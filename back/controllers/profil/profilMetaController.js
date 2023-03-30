
const Models = require("../../models");
const _ = require("lodash");

exports.addProfilMeta =  (profil_id, meta_key, meta_value) => {
  try {
     Models.ProfilMeta.create({ profil_id: profil_id, meta_key: meta_key, meta_value: !_.isEmpty(meta_value) ? meta_value : '' })

  } catch (error) {
    console.log(error)
    return {
      status: false,
      errors: ["Something went wrong please try again later."],
    };
  }
};


exports.updateProfilMeta = (profil_id, meta_key, meta_value) => {
  try {
    !_.isEmpty(meta_value) &&
      Models.ProfilMeta.update(
        {
          meta_value: meta_value,
        },
        {
          where: {
            profil_id: profil_id,
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