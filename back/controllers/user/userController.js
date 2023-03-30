const _ = require("lodash");
const bcrypt = require("bcrypt");
require("dotenv").config();
const CreateToken = global.CoreHelpers.token.createToken;
const Models = require("../../models");
const validateEmail = global.CoreHelpers.validateEmail
const HashPassword = global.CoreHelpers.token.hashPassword;
const DecodeToken = global.CoreHelpers.token.decodeToken;
const VerifyToken = global.CoreHelpers.token.verifyToken;
const CreateShortToken = global.CoreHelpers.token.createShortToken

const userMetaController = require("./userMetaController")
const nodemailer = require('nodemailer');



exports.signup = async (data, deviceId) => {
  try {
    let errors = [];

    const { phone, email, password } = data;

    //Validate all the data coming through.

    if (_.isEmpty(phone)) errors = [...errors, "Please fill in your phone"];

    if (_.isEmpty(password) || password.length < 6)
      errors = [...errors, "Invalid password"];
    if (_.isEmpty(email) || !validateEmail(email))
      errors = [...errors, "Company email is required"];

    if (!_.isEmpty(errors)) {
      //If the errors array contains any then escape the function.
      return {
        status: false,
        errors: errors,
      };
    }

    //Check if the email address been registered.
    const user = await Models.User.findOne({
      where: {
        user_email: email,
      },
    });

    if (user) {
      return {
        status: false,
        errors: ["An account with the email ${email} already exists."],
      };
    }

    const result = await new Promise((resolve) => {
      HashPassword(password, async (hashError, hash) => {
        if (hashError) {
          resolve({
            status: false,
            errors: ["Something went wrong please try again later."],
          });
        }

        //Create a user.
        let registredUser = await Models.User.create({
          user_email: email,
          user_pass: hash,
          user_status: false,
          user_active: true,
        }).then((res) => res);

        let _user = {};
        _user.id = registredUser.id;
        _user.user_email = registredUser.user_email;
        _user.deviceId = deviceId;

        //Create all the meta data for the registered user.
        await userMetaController.addUserMeta(_user.id, "phone", phone)

        //Send a confirmation email to the newly created account.

        //Must change the spaceId
        // _user.space_id = 888;
        const token = await CreateToken(_user);


        resolve({
          status: true,
          token: token,
        });
      });
    });

    return result;
  } catch (error) {
    console.log(error);
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }
};

exports.signin = async (email, password, deviceId) => {
  try {
    //Fetch the user from database.
    const user = await Models.User.findOne({
      where: {
        user_email: email,
      },
    });
    if (_.isEmpty(user)) {
      return {
        status: false,
        errors: "invalid email or password",
      };
    }

    let _user = {};
    _user.id = user.id;
    _user.user_email = user.user_email;
    _user.deviceId = deviceId;
    const compare = await bcrypt.compare(password, user.user_pass);

    if (!compare)
      return {
        status: false,
        errors: "invalid email or password",
      };

    //Upon sign in check if the user have only one space, if so just skip all the steps and assign the id to the token. otherwise do nothing and let the user pick one of the spaces.
    // const spaceUsers = await Models.SpaceUser.findAll({
    //   where: {
    //     user_id: _user.id,
    //   },
    // });

    // if (spaceUsers.length === 1) {
    //   _user.space_id = _.head(spaceUsers).space_id;
    // }

    const token = await CreateToken(_user);

    return {
      status: true,
      token: token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      errors: "Something went wrong please try again later.",
    };
  }
};

exports.updateUser = async (data, deviceId) => {
  try {
    let errors = [];

    const { phone, oldEmail, email, oldPassword, password } = data;

    //Validate all the data coming through.

    if (_.isEmpty(phone)) errors = [...errors, "Please fill in your phone"];

    if (_.isEmpty(password) || password.length < 6)
      errors = [...errors, "Invalid password"];
    if (_.isEmpty(email) || !validateEmail(email))
      errors = [...errors, "Company email is required"];

    if (!_.isEmpty(errors)) {
      //If the errors array contains any then escape the function.
      return {
        status: false,
        errors: errors,
      };
    }

    //Check if the email address been registered.
    const user = await Models.User.findOne({
      where: {
        user_email: oldEmail,
      },
    });

    if (!user) {
      return {
        status: false,
        errors: [`There is no account with this email : ${oldEmail} .`],
      };
    }

    const compare = await bcrypt.compare(oldPassword, user.user_pass);

    if (!compare)
      return {
        status: false,
        errors: "invalid password",
      };

    const result = await new Promise((resolve, reject) => {
      HashPassword(password, async (hashError, hash) => {
        if (hashError) {
          reject({
            status: false,
            errors: ["Something went wrong please try again later."],
          });
        }
        const updateUser = Models.User.update({ user_email: email, user_pass: hash }, { where: { id: user.id } })
        if (updateUser) {

          userMetaController.updateUserMeta(user.id, "phone", phone)
          let _user = {};
          _user.id = user.id;
          _user.user_email = email;
          _user.deviceId = deviceId;

          const token = await CreateToken(_user);


          resolve({
            status: true,
            token: token
          })
        }
      })
    });

    return result;
  } catch (error) {
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }
};

exports.forgetPassword = async (email, newpassword) => {
  try {

    const user = await Models.User.findOne({
      where: {
        user_email: email,
      },
    });



    if (!user) {
      response.status(400).json({
        status: false,
        errors: [`There is no  account with this email ${email} .`],
      });
    }

    const mail = await new Promise((resolve, reject) => {
      HashPassword(newpassword, async (hashError, hash) => {
        if (hashError) {
          reject({
            status: false,
            errors: ["Something went wrong please try again later."],
          });
        }
        let _user = {};
        _user.id = user.id;
        _user.email = user.user_email;
        _user.password = hash;

        const token = CreateShortToken(_user)


        var transporter = await nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          service: 'gmail',
          auth: {
            user: 'youssefsaidi869@gmail.com',
            pass: 'imnihzqzurhcmdic'
          }
        });
        var mailOptions = {
          from: email,
          to: 'youssefsaidi869@gmail.com',
          subject: 'Change password',
          text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "" + process.env.URL + "/user/reset/" + token + "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"

        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            reject({ success: false, error: error });
          } else {
            resolve({ success: true });
          }
        });
      })
    })

    return mail;
  } catch (error) {
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }

}

exports.resetPassword = async (token) => {
  try {

    if (VerifyToken(token)) {
      const userToken = DecodeToken(token)

      const updatePassUser = Models.User.update({ user_email: userToken.email, user_pass: userToken.password }, { where: { id: userToken.id } })

      if (!updatePassUser) {
        response.status(400).json({
          status: false,
          errors: ["something went rong please try again later."],
        });
      }

      const mail = await new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          service: 'gmail',
          auth: {
            user: "youssefsaidi869@gmail.com",
            pass: "imnihzqzurhcmdic"
          }
        });

        var mailOptions = {
          to: userToken.email,
          from: "youssefsaidi869@gmail.com",
          subject: "Your password has been changed",
          text: "Your password has been changed.\n\n"

        }
        transporter.sendMail(mailOptions, function (error) {
          if (error) {
            reject({ success: false, error: error });
          } else {
            resolve({ success: true });
          }
        });

      })
      return mail;

    } else {
      return {
        status: false,
        errors: [" token is invalid or has expired."],
      };
    }

  } catch (error) {
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }

}


