// import module
const { userGameLoginsModel } = require('../models_db/index')
const { Sequelize } = require('sequelize')


class LogoutModel {

    // create function to get login data based on tokenId
    static async deactivateToken(token) {
        try{
            await userGameLoginsModel.update(
                { deactivatedAt :  Sequelize.literal('NOW()') }, 
                { where: {token} }
            )
        } catch(error) {
            console.log(error)
            return error
        }
    }

}


module.exports = { LogoutModel }