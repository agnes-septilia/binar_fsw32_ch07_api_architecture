// import sequelize config 
const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('../config');


// build data for user_game_biodatas table
UserGameRooms = () => {
    try{
    const model = sequelize.define('user_game_rooms', {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            userIdOne: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userIdTwo: {
                type: DataTypes.UUID
            },
            createdAt: {
                type: DataTypes.TIME,
                allowNull: false
            },
            closedAt: {
                type: DataTypes.TIME
            },
            deactivatedAt: {
                type: DataTypes.TIME
            },
        }, {
            modelName: 'UserGameRooms',
            tableName: 'user_game_rooms',
            underscored: true,
            updatedAt: false,
        });

        return model
    } catch(error) {
        console.log(error)
        res.status(500).render('error')
    }
}

module.exports = { UserGameRooms }


