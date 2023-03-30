const VerifyToken = global.CoreHelpers.token.verifyToken


validateToken = (request, response, next) => {
    try {


        const token = request.headers.autorization
        if (VerifyToken(token)) {
            next()
        } else {
            response.status(400).json({
                status: false,
                error: ["Invalid token"]
            });
        }

    } catch (error) {
        response.status(400).json({
            status: false,
            error: error
        });
    }

}

module.exports = validateToken