const { userGamesModel, userGameBiodatasModel, userGameHistoriesModel } = require('../models_db/index')
const { Sequelize } = require('sequelize')
const { col } = Sequelize


class userProfileModel {

    // get latest update of biodata
    static async getBiodata(id) {
        try {
            const data = await userGamesModel.findOne({
                attributes: [
                    'id',
                    'username',
                    'email',
                    'avatar',
                    [col('"user_game_biodata"."gender"'), 'gender'],
                    [col('"user_game_biodata"."country"'), 'country'],
                    [col('"user_game_biodata"."occupation"'), 'occupation'],
                    [col('"user_game_biodata"."date_of_birth"'), 'dateOfBirth']
                ],
                include: {
                    model: userGameBiodatasModel,
                    attributes: []
                },
                where: {id},
                raw: true
            })

            return data

        } catch(error) {
            console.log(error)
            return error
        }
    }


    // get game history
    static async getGameHistory(userId) {
        try {
            const data = await userGameHistoriesModel.findAll({
                attributes: [
                    'user_id',
                    [Sequelize.literal('to_char(created_at, \'YYYY-MM-DD HH:MI:SS\')'), 'createdAt'],
                    'weapon', 
                    'result',
                    'score'
                ],
                where: {userId},
                order: [['created_at', 'ASC']],
                raw: true
            })

            return data

        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create new biodata on database 
    static async createNewBiodata(id, data) {
        try{            
            await userGameBiodatasModel.create({
                userId: id,
                gender: data.gender, 
                country: data.country,
                occupation: data.occupation,
                dateOfBirth: data.dateOfBirth || null,
                createdAt: Sequelize.literal('NOW()'),
                updatedAt: Sequelize.literal('NOW()')
            })          

        } catch(error) {
            console.log(error)
            return error
        }
    }


    // update biodata on database 
    static async saveToBiodata(id, data) {
        try{            
            await userGameBiodatasModel.update({ 
                gender: data.gender, 
                country: data.country,
                occupation: data.occupation,
                dateOfBirth: data.dateOfBirth || null,
                updatedAt: Sequelize.literal('NOW()')
                },
                { where: {userId: id} }
            );

        } catch(error) {
            console.log(error)
            return error
        }
    }

}

module.exports = { userProfileModel }