const ProfilRoute = require("express").Router()
const ProfilController = require("../../controllers/profil/profilController");
const DecodeToken = global.CoreHelpers.token.decodeToken

const ValidateToken = require('../../services/validateToken')



ProfilRoute.post('/user/profil/add', ValidateToken, async (request, response, next) => {

	try {
		let { data } = request.body;
		const token = DecodeToken(request.headers.autorization)
		const result = await ProfilController.addProfil(request.body, token);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}



})




ProfilRoute.put('/user/profil/update', ValidateToken, async (request, response, next) => {

	try {
		let { data } = request.body;
		const token = DecodeToken(request.headers.autorization)
		const result = await ProfilController.updateProfil(request.body, token);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}



})

ProfilRoute.delete('/user/profil/delete', ValidateToken, async (request, response, next) => {

	try {
		let { data } = request.body;
		const token = DecodeToken(request.headers.autorization)
		const result = await ProfilController.deleteProfil(request.body.idProfil,token);
		response.status(200).json(result);

	} catch (error) {
		response.status(400).json(error);
	}



})






module.exports = ProfilRoute