const { UserGames } = require('./user_games')
const { UserGameLogins } = require('./user_game_logins')
const { UserGameBiodatas } = require('./user_game_biodatas')
const { UserGameRooms } = require('./user_game_rooms')
const { UserGameHistories } = require('./user_game_histories')

let userGamesModel = UserGames()
let userGameLoginsModel = UserGameLogins()
let userGameBiodatasModel = UserGameBiodatas()
let userGameRoomsModel = UserGameRooms()
let userGameHistoriesModel = UserGameHistories()


// assign association
userGamesModel.hasMany(userGameLoginsModel, {foreignKey:"userId"})
userGamesModel.hasOne(userGameBiodatasModel, {foreignKey:"userId"})
userGamesModel.hasMany(userGameRoomsModel, {foreignKey:"userIdOne"})
userGamesModel.hasMany(userGameRoomsModel, {foreignKey:"userIdTwo"})
userGamesModel.hasMany(userGameHistoriesModel, {foreignKey:"userId"})
userGameRoomsModel.hasMany(userGameHistoriesModel, {foreignKey: "roomId"})

module.exports = {
    userGamesModel,
    userGameLoginsModel,
    userGameBiodatasModel,
    userGameRoomsModel,
    userGameHistoriesModel
}