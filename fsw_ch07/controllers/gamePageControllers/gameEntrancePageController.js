// import modules
const { tokenCheck } = require('../../lib/TokenCheck')


class gameEntrancePageController {

    // show room page
    static async showGameEntrancePage(req, res) {
        try {
            // check token availability
            const token = await tokenCheck(req, res)

            if (token === null) {
                res.render('RegisterPage/login')
            } else {
                res.render('GamePage/entrance', {source: 'landing'})
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}


module.exports = { gameEntrancePageController }
