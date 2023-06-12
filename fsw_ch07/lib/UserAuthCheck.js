const JWT = require('jsonwebtoken')

function userAuthCheck(req, res, next) {
    const token = req.cookies.token;
    if(token !== null && token !== process.env.SUPERADMIN_TOKEN) {
        try {
            const validToken = JWT.verify(token, process.env.JWT_PASSKEY);
            console.log('token:', validToken)  
            next()
        } catch(error) {  // handler if the jwt is expired
            console.log(error)
            res.status(401).render('pageNotAuthorized')
        }
    } else {  // handler if the token is expired
        res.status(401).render('pageNotAuthorized')
    }
}

module.exports = {userAuthCheck}