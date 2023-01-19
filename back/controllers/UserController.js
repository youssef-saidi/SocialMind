const _ = require("lodash");
const bcrypt = require("bcrypt");
const db = require("../models");
require("dotenv").config();
const CreateToken = global.CoreHelpers.token.createToken;
const Models = require("../models");
const HashPassword = global.CoreHelpers.token.hashPassword;
const validateEmail = (email) =>
  email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
const decodeToken = global.CoreHelpers.token.decodeToken;
const verifyToken = global.CoreHelpers.token.verifyToken;

exports.signup = async (data, deviceId) => {
  try {
    let errors = [];

    const { name, email, password } = data;

    //Validate all the data coming through.

    if (_.isEmpty(name)) errors = [...errors, "Please fill in your name"];

    if (_.isEmpty(password) || password.length < 6)
      errors = [...errors, "Invalid password"];
    if (_.isEmpty(email) || !validateEmail(email))
      errors = [...errors, "Company email is reqiured"];

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
        const userMeta = await Models.UserMeta.create({
          user_id: _user.id,
          meta_key: "name",
          meta_value: name,
        });

        if (!userMeta) {
          resolve({
            status: false,
            errors: ["Something went wrong please try again later."],
          });
        }
        //Send a confirmation email to the newly created account.

        //Must change the spaceId
        _user.space_id = 888;
        const token = await CreateToken(_user);

        console.log(token);
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
    const spaceUsers = await Models.SpaceUser.findAll({
      where: {
        user_id: _user.id,
      },
    });

    if (spaceUsers.length === 1) {
      _user.space_id = _.head(spaceUsers).space_id;
    }

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
