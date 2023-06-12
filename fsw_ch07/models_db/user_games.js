// import sequelize config 
const { DataTypes, Sequelize} = require('sequelize')
const { sequelize } = require('../config')

// build data for user_games table
UserGames = () => {
    try{
    const model = sequelize.define('user_games', {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            avatar: {
                type: DataTypes.TEXT
            },
            createdAt: {
                type: DataTypes.TIME,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.TIME,
                defaultValue: Sequelize.literal('NOW()'),
                allowNull: false
            }
        }, {
            modelName: 'UserGames',
            tableName: 'user_games',
            underscored: true,
        });


        return model

    } catch(error) {
        console.log(error)
        res.status(500).render('error')
    }
}

module.exports = { UserGames }

