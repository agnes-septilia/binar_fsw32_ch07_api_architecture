const JWT = require('jsonwebtoken')

function tokenCheck(req, res) {
    const token = req.cookies.token;
    if(token) {
        try {
            const validToken = JWT.verify(token, process.env.JWT_PASSKEY);
            console.log('token:', validToken)  
            return validToken
        } catch(error) {  
            console.log(error)
            return error
        }
    } else {  
        return null
    }
}

module.exports = {tokenCheck}