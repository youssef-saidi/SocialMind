
const Models = require("../../models");
const _ = require("lodash");

exports.addUserMeta =  (user_id, meta_key, meta_value) => {
  try {
     Models.UserMeta.create({ user_id: user_id, meta_key: meta_key, meta_value: !_.isEmpty(meta_value) ? meta_value : '' })

  } catch (error) {
    console.log(error)
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }
};

exports.updateUserMeta = (user_id, meta_key, meta_value) => {
  try {
    !_.isEmpty(meta_value) &&
      Models.UserMeta.update(
        {
          meta_value: meta_value,
        },
        {
          where: {
            user_id: user_id,
            meta_key: meta_key,
          },
        }
      );
  } catch (error) {
    console.log(error)
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }
};

// exports.changeUserMeta = (token, lastname, firstname) => {
//     try {
//         if (!verifyToken(token)) {
//             return {
//                 status: false,
//                 errors: ['Something went wrong please try again later.']
//             }
//         }

//         token = decodeToken(token);
//         const lastnameUpdate = db.UserMeta.update({ meta_value: lastname }, { where: { user_id: token.id, meta_key: "lastname" } })
//         const firstnameUpdate = db.UserMeta.update({ meta_value: firstname }, { where: { user_id: token.id, meta_key: "firstname" } })

//         if (lastnameUpdate != null && firstnameUpdate != null) {
//             return {
//                 status: true,
//                 errors: ['user meta updated']
//             };
//         } else {
//             return {
//                 status: false,
//                 errors: ['Something went wrong please try again later.']
//             };
//         }

//     } catch (error) {
//         return {
//             status: false,
//             errors: ['Something went wrong please try again later.']
//         };
//     }
// }

// exports.getUserMeta = (id) => {
//     try {
//         const data = db.UserMeta.findAll({ where: { user_id: id } })
//         if (data != null) {
//             return data
//         } else {
//            return false
//         }

//     } catch (error) {
//         return false
//     }
// }

// exports.AddUserMeta = (metaKey, metaValue, id) => {
//     try {
//         const create = db.UserMeta.create({ meta_key: metaKey, meta_value: metaValue, user_id: id })
//         if (!create) {
//             return create
//         } else {
//             return true
//         }
//     } catch (error) {
//         return false
//     }
// }
