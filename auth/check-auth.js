const jwt = require("jsonwebtoken")

const HttpError = require("../utils/http-error")

module.exports = (req, res, next) => {
    // console.log(req.headers.authorization)
    // if (req.method === 'OPTIONS'){
    //     return next()
    // }

    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) {
            throw new Error('Authentication failed')
        }
    
        const decodedToken = jwt.verify(token, process.env.CLEF_JWT)
        req.userData = { userId: decodedToken.id}
        next()
    } catch (error) {
        const err = new HttpError('Authentification a échoué', 403)
        return next(error)
    }

}