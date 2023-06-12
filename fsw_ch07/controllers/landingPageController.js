//import moduls
const JWT = require('jsonwebtoken')
const { topScorer } = require('../models/landingPageModels')


class landingPageController {
    
    static async showLandingPage(req, res) {
        try {
            // get top scorer list
            const scorerList = topScorer.getTopScorers()

            // check token
            const token = req.cookies.token;

            
            // check if token is available
            if (token === undefined) {
                res.render('LandingPage', {
                    scorerList,
                    token: null
                })

            } else {
                // if token is available -> change menu on NavBar
                const validToken = JWT.verify(token, process.env.JWT_PASSKEY);
                
                res.render('LandingPage', {
                    scorerList,
                    token: 'exist',
                    id : validToken.id,
                    username : validToken.username,
                    avatar : 'images/avatars/' + validToken.avatar
                })
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}


module.exports = { landingPageController }



