const SpaceRoute = require("express").Router()
const SpaceController = require("../controllers/SpaceController")

SpaceRoute.post("/updateSpace", (request, response, next) => {
    
    try {
        const update = SpaceController.changeSpaceMeta(request.headers.token, request.body.company_name, request.body.name, request.body.company_address, request.body.city, request.body.state, request.body.zip_code, request.body.country, request.body.phone, request.body.email, request.body.website)
        update.then(res => response.status(200).json(res))

    } catch (error) {
        response.status(400).json({
            status: false,
            errors: "Something went wrong please try again later.",
        });
    }

});


module.exports = SpaceRoute
