const UserMetaRoute = require("express").Router()
const UserMetaController = require("../controllers/UserMetaController")


// UserMetaRoute.get("/getUsermeta/:id", (req, res, next) => {
// 	UserMetaController.getUserMeta(req.params.id).then((resp) => {
// 		res.status(200).json(resp)
// 	}).catch((err) => res.status(400).json(err))
// })



// UserMetaRoute.post("/addUserMeta", VerifToken, (req, res, next) => {
// 	UserMetaController.AddUserMeta(req.body.metaKey, req.body.metaValue, req.body.UserId).then((resp) => {
// 		res.status(200).json(resp)
// 	}).catch((err) => res.status(400).json(err))

// })

UserMetaRoute.post("/updateUserMeta", (request, response, next) => {
	try {
		const update=UserMetaController.changeUserMeta(request.headers.token,request.body.lastname, request.body.firstname )
		response.status(200).json(update);

	} catch (error) {

		response.status(400).json({
			status: false,
			errors: "Something went wrong please try again later.",
		});
	}

})

module.exports = UserMetaRoute
