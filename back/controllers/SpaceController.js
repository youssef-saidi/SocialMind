const db = require("../models")
const _ = require('lodash');
const decodeToken = global.CoreHelpers.token.decodeToken
const verifyToken = global.CoreHelpers.token.verifyToken


exports.changeSpaceMeta = async (token, company_name, name, company_address, city, state, zip_code, country, phone, email, website ) => {
    try {

        if (!verifyToken(token)) {
            return {
                status: false,
                errors: ['Something went wrong please try again later.']
            }
        }

        token = decodeToken(token);
        // Get the space user
        const spaceUser =  await db.SpaceUser.findOne({ where: { user_id: token.id } })
    
        if (_.isEmpty(spaceUser)) return {
            status: false,
            errors: "Space don't exist"
        };
        //Update Space
        await db.Space.update({ name: name }, { where: { id: spaceUser.space_id} })

        // Update SpaceMeta
        await db.SpaceMeta.update({ meta_value: company_name }, { where: { space_id: spaceUser.space_id, meta_key: "company_address" } })
        await db.SpaceMeta.update({ meta_value: city }, { where: { space_id: spaceUser.space_id, meta_key: "city" } })
        await db.SpaceMeta.update({ meta_value: company_address }, { where: { space_id: spaceUser.space_id, meta_key: "company_address" } })
        await db.SpaceMeta.update({ meta_value: state }, { where: { space_id: spaceUser.space_id, meta_key: "state" } })
        await db.SpaceMeta.update({ meta_value: zip_code }, { where: { space_id: spaceUser.space_id, meta_key: "zip_code" } })
        await db.SpaceMeta.update({ meta_value: country }, { where: { space_id: spaceUser.space_id, meta_key: "country" } })
        await db.SpaceMeta.update({ meta_value: phone }, { where: { space_id: spaceUser.space_id, meta_key: "phone" } })
        await db.SpaceMeta.update({ meta_value: email }, { where: { space_id: spaceUser.space_id, meta_key: "email" } })
        await db.SpaceMeta.update({ meta_value: website }, { where: { space_id: spaceUser.space_id, meta_key: "website" } })
        // await db.SpaceMeta.update({ meta_value: certificate }, { where: { space_id: spaceUser.space_id, meta_key: "certificate" } })
            return {
                status: true,
                errors: ['Space  updated']
            };
        

    } catch (error) {
        console.log(error)
        return {
            status: false,
            errors: ['Something went wrong please try again later.']
        };
    }
}

