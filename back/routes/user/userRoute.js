const _ = require('lodash');
const Bcrypt = require("bcrypt")
const Models = require('../../models');
const CreateToken = global.CoreHelpers.token.createToken;
const DecodeToken = global.CoreHelpers.token.decodeToken
const VerifyToken = global.CoreHelpers.token.verifyToken
const CreateShortToken = global.CoreHelpers.token.createShortToken
const HashPassword = global.CoreHelpers.token.hashPassword;
const ValidateToken=require('../../services/validateToken')

require("dotenv").config();




const UserRoute = require("express").Router()
const UserController = require("../../controllers/user/userController");

UserRoute.post("/user/signup", async (request, response, next) => {

	try {
		let { data } = request.body;
		const deviceId = request.headers.deviceid;

		const result = await UserController.signup(request.body, deviceId);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}

	return next();

});


UserRoute.post("/user/signin",ValidateToken, async (request, response, next) => {

	try {
		
		const { email, password } = request.body;
		const { deviceid } = request.headers;

		const result = await UserController.signin(email, password, deviceid);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}

	return next();

});


UserRoute.put("/user/update", ValidateToken,async (request, response, next) => {

	try {
		let { data } = request.body;
		const deviceId = request.headers.deviceid;

		const result = await UserController.updateUser(request.body, deviceId);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}

	return next();

});

UserRoute.post("/user/forgotPassword", ValidateToken,async (request, response, next) => {
	try {


		const email = request.body.email;
		const newpassword = request.body.password

		const result = await UserController.forgetPassword(email, newpassword);
		response.status(200).json(result);


	} catch (error) {
		response.status(400).json(error);

	}
	return next();
});


UserRoute.post("/user/reset/:token", ValidateToken,async (request, response, next) => {
	try {


		const token = request.params.token


		const result = await UserController.resetPassword(token);
		response.status(200).json(result);


	} catch (error) {
		response.status(400).json(error);

	}

	return next();

})


// UserRoute.post("/user/updateEmail", async (request, response, next) => {

// 	try {

// 		const update = await UserController.updateUserEmail(request.headers.token, request.body.password, request.body.newEmail);
// 		clg
// 		response.status(200).json(update);

// 	} catch (error) {
// 		response.status(400).json({
// 			status: false,
// 			errors: "Something went wrong please try again later.",
// 		});
// 	}

// 	return next();

// });

// UserRoute.post("/user/updatePassword", async (request, response, next) => {

// 	try {

// 		const update = await UserController.updateUserPassword(request.headers.token, request.body.password, request.body.newpassword);

// 		response.status(200).json(update);


// 	} catch (error) {
// 		response.status(400).json({
// 			status: false,
// 			errors: "Something went wrong please try again later.",
// 		});
// 	}

// 	return next();

// });

module.exports = UserRoute
