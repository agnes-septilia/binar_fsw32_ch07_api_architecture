// import modules
const { userGameRoomsModel, userGameHistoriesModel } = require('../../models_db/index')
const { Sequelize } = require('sequelize')
const { sequelize } = require('../../config')


class GamePlayModel {

    // create function to send first user weapon to database
    static async sendUserWeapon(roomId, userId, round, weapon) {
        try{
            await userGameHistoriesModel.create({
                roomId,
                userId,
                round,
                weapon,
                createdAt: Sequelize.literal('NOW()')
            })
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to get opponent weapon
    static async getOpponentWeapon(roomId, round, opponentUserId) {
        try{
            const data = await userGameHistoriesModel.findOne({
                attributes: ['weapon'],
                where: {
                    roomId,
                    round,
                    userId : opponentUserId
                },
                raw: true
            })
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to update history table with result and score
    static async updateGame(roomId, userId, round, result, score) {
        try{
            await userGameHistoriesModel.update(
                { result, score }, 
                { where: { roomId, userId, round } } 
            )
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // create function to deactivate the room as the game ends
    static async deactivateRoom(roomId) {
        try{
            await userGameRoomsModel.update(
                { deactivatedAt: Sequelize.literal('NOW()') },
                { where: {id: roomId}}
            )
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // create function to get summary of game result
    static async calculateResult(roomId) {
        try{
            let [result] = await sequelize.query(`
                SELECT 
                    ugr.id
                    , ugr.user_id_one
                    , ugr.user_id_two
                    , SUM(ugh.score) FILTER (WHERE user_id_one = ugh.user_id) AS player_score_one
                    , SUM(ugh.score) FILTER (WHERE user_id_two = ugh.user_id) AS player_score_two
                FROM user_game_rooms ugr 
                JOIN user_game_histories ugh ON ugh.room_id = ugr.id 
                WHERE ugr.id = '${roomId}'
                GROUP BY ugr.id, ugr.user_id_one, ugr.user_id_two
            `)
            
            const roomResult = result[0]
            console.log(roomResult)
            return roomResult
        } catch(error) {
            console.log(error)
            return error
        }
    }
}

module.exports = { GamePlayModel }