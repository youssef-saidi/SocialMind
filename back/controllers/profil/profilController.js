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

const profilMetaController = require("./profilMetaController")
const nodemailer = require('nodemailer');






exports.addProfil = async (data, token) => {

    try {

        let errors = [];

        const { name, description } = data;

        //Validate all the data coming through.

        if (_.isEmpty(name)) errors = [...errors, "Please fill in your name"];

        if (_.isEmpty(description))
            errors = [...errors, "Invalid description"];


        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //create new profil.
        const profil = await Models.Profil.create({ user_id: token.id, profil_name: name });

        if (!profil) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."],
            };
        }
        //add 1 to number of profil to user
        //i must change 1 by user_id located in the token
        const changeUserNbProfil = Models.User.increment('profil_number', { by: 1, where: { id: token.id } })

        //create profil meta
        await profilMetaController.addProfilMeta(profil.id, 'description', description)



        return {
            status: true,
            message: ["profil has been created successfully"]
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.updateProfil = async (data, token) => {
    try {
        let errors = [];
        const { idProfil, name, description } = data;

        //Validate all the data coming through.


        if (_.isEmpty(name)) errors = [...errors, "Please fill in your name"];

        if (_.isEmpty(description))
            errors = [...errors, "Invalid description"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //Check if the email address been registered.
        const profil = await Models.Profil.findOne({
            where: {
                id: idProfil,
                user_id: token.id,

            },
        });

        if (!profil) {
            return {
                status: false,
                errors: [`There is no profil with this name : ${name} .`],
            };
        }

        const updateProfil = Models.Profil.update({ profil_name: name }, { where: { id: idProfil } })
        if (updateProfil) {

            profilMetaController.updateProfilMeta(idProfil, "description", description)

        }

        return {
            status: true,
            message: ["profil updated successfully"]
        };
    } catch (error) {
        console.log(error)
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
};


exports.deleteProfil = async (id,token) => {
    try {
        const deleteProfil = Models.Profil.destroy({ where: { id: id } })
        if (deleteProfil) {
            const changeUserNbProfil = Models.User.decrement('profil_number', { by: 1, where: { id: token.id } })

            return {
                status: true,
                message: ["profil deleted successfully"]
            };
        }

    } catch (error) {
        console.log(error)
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }



}