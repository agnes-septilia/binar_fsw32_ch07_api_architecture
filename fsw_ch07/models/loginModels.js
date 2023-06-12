// import module
const { userGamesModel, userGameLoginsModel } = require('../models_db/index')


class LoginModel {

    // create function to check customer's email and password
    static #checkData = async function(email) {
        try{
            const data = await userGamesModel.findOne({ 
                attributes: [
                    'id',
                    'username',
                    'email',
                    'password',
                    'avatar'
                ],
                where: { email },
                raw: true
            })

            console.log("datauser ", data)
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to process the data
    static async checkLoginValidity(email, password, next){
        try{
            // check user based on their email
            const checkUser = await this.#checkData(email)

            console.log("hasil email", checkUser)

            // get conditions based on search result
            let checkResult = null

            switch (true) {                   
                // if user is superadmin
                case email === process.env.SUPERADMIN_EMAIL && password === process.env.SUPERADMIN_PASSWORD :
                    checkResult = 'superAdmin'
                    break
                    
                // if email is not found
                case checkUser === null:
                    checkResult = 'emailNotFound'
                    break

                // if password not match
                case checkUser !== null && checkUser.password !== password:
                    checkResult = 'wrongPassword'
                    break 

                default:
                    checkResult = checkUser

            }

            return checkResult

        } catch(error) {
            console.log(error)
            return error
        }
    }


    
    // create function to save login data 
    static async saveLoginData(userId, token) {
        try{
            await userGameLoginsModel.create({ 
                userId: userId,
                token
            })
        } catch(error) {
            console.log(error)
            return error
        }
    }


}


module.exports = { LoginModel }