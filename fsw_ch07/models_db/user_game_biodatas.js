// import sequelize config 
const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('../config');


// build data for user_game_biodatas table
UserGameBiodatas = () => {
    try{
    const model = sequelize.define('user_game_biodatas', {
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
            gender: {
                type: DataTypes.STRING,
            },
            country: {
                type: DataTypes.STRING,
            },
            occupation: {
                type: DataTypes.STRING,
            },  
            dateOfBirth: {
                type: DataTypes.DATEONLY,
            },
            createdAt: {
                type: DataTypes.TIME,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.TIME,
                defaultValue: Sequelize.literal('NOW()'),
                allowNull: false
           },
        }, {
            modelName: 'UserGameBiodatas',
            tableName: 'user_game_biodatas',
            underscored: true
        });

        return model
    } catch(error) {
        console.log(error)
        res.status(500).render('error')
    }
}

module.exports = { UserGameBiodatas }


