// import sequelize config 
const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('../config');


// build data for user_game_logins table
UserGameLogins = () => {
    try{
    const model = sequelize.define('user_game_logins', {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            }, 
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.TIME,
                defaultValue: Sequelize.literal(`NOW()`),
                allowNull: false
            },
            deactivatedAt: {
                type: DataTypes.TIME
            },
            expiredAt: {
                type: DataTypes.TIME,
                defaultValue: Sequelize.literal(`NOW() + INTERVAL '1 day'`),
                allowNull: false
            },
        }, {
            modelName: 'UserGameLogins',
            tableName: 'user_game_logins',
            updatedAt: false,
            underscored: true
        });

        return model
    } catch(error) {
        console.log(error)
        res.status(500).render('error')
    }
}

module.exports = { UserGameLogins }


