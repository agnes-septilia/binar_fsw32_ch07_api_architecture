// import sequelize config 
const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('../config');


// build data for user_game_logins table
UserGameHistories = () => {
    try{
    const model = sequelize.define('user_game_histories', {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            roomId: {
                type: DataTypes.UUID,
                allowNull: false,  
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            }, 
            round: {
                type: DataTypes.INTEGER
            }, 
            weapon: {
                type: DataTypes.STRING
            },
            result: {
                type: DataTypes.STRING
            },
            score: {
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.TIME,
            },
        }, {
            modelName: 'UserGameHistories',
            tableName: 'user_game_histories',
            updatedAt: false,
            underscored: true
        });

        return model
    } catch (error) {
        console.log(error)
        res.status(500).render('error')
    }
}

module.exports = { UserGameHistories} 


