//import module
const { userGamesModel, userGameRoomsModel } = require('../../models_db/index')
const { Sequelize } = require('sequelize')
const { Op } = Sequelize 


class GameRoomModel {

    // create function to check room availability
    static async slotCheck(){
        try {
            const availSlot = await userGameRoomsModel.findOne({
                attributes: ['id', 'userIdOne', 'userIdTwo'],
                where: { 
                    closedAt: { [Op.is]: null},
                    deactivatedAt: { [Op.is]: null}
                },
                order: [
                    ['createdAt', 'ASC']
                ],
                raw: true
            })
            return availSlot

        } catch(error) {
            console.log(error)
            return error
        }
    }

    
    // create new room
    static async createRoom(userId) {
        try {
            await userGameRoomsModel.create({
                userIdOne: userId,
                createdAt: Sequelize.literal('NOW()')
            })   
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // set user as second player
    static async assignSecondPlayer(roomId, userIdTwo) {
        try {
            await userGameRoomsModel.update(
                { userIdTwo }, 
                { where: { id: roomId }}
            )
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // get user data for opponent
    static async getOpponentData(userId) {
        try {
            const data = await userGamesModel.findOne({
                attributes: ['id', 'username', 'avatar'],
                where: {id : userId},
                raw: true
            })
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // close room as both users will be proceed to the game
    static async closeRoom(roomId) {
        try {
            await userGameRoomsModel.update(
                { closedAt: Sequelize.literal('NOW()') },
                { where: { id: roomId }}
            )
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // delete any rooms where user might be assigned to another pending room, since user will start the game
    static async deletePendingRoom(userId) {
        try {
            await userGameRoomsModel.destroy({
                where: {
                    userIdOne: userId, 
                    closedAt: { [Op.is]: null}
                }
            })
        } catch(error) {
            console.log(error)
            return error
        }
    }



}

module.exports = { GameRoomModel }