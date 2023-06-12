// import modules
const { LogoutModel } = require('../models/logoutModels');


class logoutController {

    // Operations for logout
    static async logoutConfirmation(req, res) {
        try {
            // get data from active token
            const token = req.cookies.token;

            // deactivate the token in db
            await LogoutModel.deactivateToken(token)

            // stop the cookies
            res.clearCookie('token')

            // redirect the landing page
            res.redirect('/')

        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}


module.exports = { logoutController }



