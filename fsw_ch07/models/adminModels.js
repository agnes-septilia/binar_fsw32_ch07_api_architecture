const { userGamesModel, userGameLoginsModel, userGameBiodatasModel, userGameRoomsModel, userGameHistoriesModel } = require('../models_db/index')
const { Sequelize } = require('sequelize')
const { sequelize } = require('../config')
const { Op } = Sequelize

class AdminModel {
    
    // create function to get all data from user games model
    static async allData() {
        try {
            let [result] = await sequelize.query(`
                SELECT  
                    ug.id,
                    ug.username,
                    ug.email,
                    ug."password" AS password,
                    to_char(ug.created_at, 'YYYY-MM-DD HH:MI:SS') AS created_at,
                    ugb.gender,
                    ugb.country,
                    ugb.occupation,
                    ugb.date_of_birth,
                    COUNT(ugh.id) FILTER (WHERE ugh.result = 'win') AS total_wins,
                    COUNT(ugh.id) FILTER (WHERE ugh.result = 'draw') AS total_draws,
                    COUNT(ugh.id) FILTER (WHERE ugh.result = 'lose') AS total_loses,
                    COALESCE(SUM(ugh.score), 0) AS total_scores
            
                FROM user_games ug 
                LEFT JOIN user_game_biodatas ugb on ugb.user_id = ug.id 
                LEFT JOIN user_game_histories ugh on ugh.user_id = ug.id 
                GROUP BY ug.id,
                    ug.username,
                    ug.email,
                    ug."password",
                    ug.created_at,
                    ugb.gender,
                    ugb.country,
                    ugb.occupation,
                    ugb.date_of_birth
                ORDER BY ug.created_at
            `)

            return result
        
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to check email availability 
    static async checkEmail(email) {
        try{
            const data = await userGamesModel.findOne({ 
                attributes: ['email'] ,
                where: { email },
                raw: true
            })
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to add data to database
    static async addData(data) {
        const transaction = await sequelize.transaction();

        try{
            // get data from user
            const {username, email, password, dateOfBirth, ...rest} = data
            
            // insert user data to database 
            const addUserGames = await userGamesModel.create({ 
                username, 
                email, 
                password,
                createdAt: Sequelize.literal('NOW()'),
                updatedAt: Sequelize.literal('NOW()')
                }, { transaction })
            
            // get user id 
            const userID = addUserGames.id

            await userGameBiodatasModel.create({
                ...rest, 
                userId : userID,
                dateOfBirth: dateOfBirth || null,                
                createdAt: Sequelize.literal('NOW()'),
                updatedAt: Sequelize.literal('NOW()')
            }, { transaction })

            await transaction.commit();

        } catch(error) {
            await transaction.rollback()
            console.log(error)
            return error
        }
    }
    

    // create function to check whether we have existing data in biodata table
    static async getOldBiodata(userId) {
        try{
            const data = await userGameBiodatasModel.findOne({
                attributes: ['id'],
                where: { user_id: userId },
                raw: true 
            })
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to create new biodata
    static async createNewBiodata(userId) {
        try {
            await userGameBiodatasModel.create({
                userId,
                createdAt: Sequelize.literal('NOW()')
            })
        } catch(error) {
            console.log(error)
            return error
        }
    }

    
    // create function to edit data by id 
    static async editData(data) {
        const transaction = await sequelize.transaction();

        try{
            // get data from user
            const {editButton, username, email, dateOfBirth, ...rest} = data  // data.editButton saves the information about id
            
            // update data to database 
            await userGamesModel.update(
                { username, 
                    email,
                    updatedAt: Sequelize.literal('NOW()')
                },
                { where: {id:editButton} },
                { transaction }
            );

            await userGameBiodatasModel.update(
                { ...rest, 
                    dateOfBirth: dateOfBirth || null,
                    updatedAt: Sequelize.literal('NOW()')
                },
                { where: {userId: editButton} },
                { transaction }
            );

            await transaction.commit();

        } catch(error) {
            await transaction.rollback()
            console.log(error)
            return error
        }
    }


    // create function to check if user has played any games
    static async getRoomData(userId) {
        try{
            const data = await userGameRoomsModel.findOne({
                attributes: ['id'],
                where: {[Op.or]: [{ userIdOne: userId }, { userIdTwo: userId }]},
                raw: true 
            })
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // create function to delete data in biodata table by id 
    static async deleteBiodata(userId) {
        try{
            await userGameBiodatasModel.destroy({where: { userId }}); 
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to delete data in biodata, login, and user table by id 
    static async deleteAllData(userId) {
        const transaction = await sequelize.transaction();

        try{
            await userGameBiodatasModel.destroy(
                {where: { userId }},
                { transaction }
                );

            await userGameLoginsModel.destroy(
                { where: { userId } },
                { transaction }
            );

            await userGamesModel.destroy(
                { where: { id: userId } },
                { transaction }
            );

            await transaction.commit();

            
        } catch(error) {
            await transaction.rollback()
            console.log(error)
            return error
        }
    }


}

module.exports = { AdminModel }