// import modules
const { GameRoomModel } = require('../../models/gameModels/gameRoomModel')
const { tokenCheck } = require('../../lib/TokenCheck')


class gameRoomPageController {
    // show room page
    static async loadGameRoomPage(req, res) {
        try {

            // check token availability
            const token = await tokenCheck(req, res)
            console.log("Token availability", token)

            if (token === null) {
                res.render('RegisterPage/login')
            } else {
                let count = 0   // to count the loop
                let flag = 0    // to mark if the room is closed

                // create looping function to load room availability
                async function loadRoom() {
                    try {
                        // function to check available room and assign player
                        async function roomCheck() {
                            // check if any room that is active or open
                            const userId = token.id
                            const availRoom = await GameRoomModel.slotCheck()


                            let roomResult = ''
                            switch (true) {

                                // Case 1: if no active room is found --> user will create new room and become P1
                                case availRoom === null :
                                    GameRoomModel.createRoom(userId)
                                    roomResult = 'created'
                                    break 

                                
                                // Case 2: if active room is found, user is not P1, and P2 is vacant  --> user enters room as P2
                                case availRoom !== null && availRoom.userIdOne !== userId && availRoom.userIdTwo === null :
                                    GameRoomModel.assignSecondPlayer(availRoom.id, userId)
                                    roomResult = 'closedAsP2'
                                    
                                    // delete possible pending rooms where P2 was accidentally assigned as P1
                                    GameRoomModel.deletePendingRoom(userId)

                                    break
                                    

                                // Case 3: if active room is found, user has already been P1, and P2 is filled --> user enters room as P1
                                case availRoom !== null && availRoom.userIdOne === userId && availRoom.userIdTwo !== null :
                                    // P1 will close the room that already filled by P2
                                    await GameRoomModel.closeRoom(availRoom.id)
                                    roomResult = 'closedAsP1'

                                    // delete pending rooms where P1 was also assigned as another P1 in other open room
                                    GameRoomModel.deletePendingRoom(userId)
                                    break


                                // Case 4: if active room is found, user has already been P1, and P2 is vacant --> user have to wait
                                case availRoom !== null && availRoom.userIdOne === userId && availRoom.userIdTwo === null :
                                    roomResult = 'waiting'

                            }

                            return {availRoom, roomResult}
                        }

                        // run room check function
                        let roomStatus = await roomCheck()

                        switch (roomStatus.roomResult) {
                            // case 1: load room is finish, user enter game as P1
                            case 'closedAsP1':
                                const userTwo = await GameRoomModel.getOpponentData(roomStatus.availRoom.userIdTwo)
                                flag = 1
                                res.render('GamePage', {playerInfo: { 
                                    player: 1,
                                    roomId: roomStatus.availRoom.id,
                                    round: 1,
                                    userId: token.id, 
                                    username: token.username,
                                    avatar:'images/avatars/' + token.avatar,
                                    opponentUserId: userTwo.id,
                                    opponentUsername: userTwo.username,
                                    opponentAvatar: 'images/avatars/' + userTwo.avatar
                                }})
                                break

                            // case 2: load room is finish, user enter game as P2
                            case 'closedAsP2' :
                                const userOne = await GameRoomModel.getOpponentData(roomStatus.availRoom.userIdOne)
                                flag = 1
                                res.render('GamePage', { playerInfo: {
                                    player: 2,
                                    roomId: roomStatus.availRoom.id,
                                    round: 1,
                                    userId: token.id, 
                                    username: token.username,
                                    avatar:'images/avatars/' + token.avatar,
                                    opponentUserId: userOne.id,                     
                                    opponentUsername: userOne.username,
                                    opponentAvatar: 'images/avatars/' + userOne.avatar
                                    }
                                })
                            
                            // case 3: new room is created or waiting
                            default: 
                                count++
                                flag = 0
                        }

                        return {flag, count}

                    } catch(error) {
                        console.log(error)
                        res.status(500).render('error')
                    }
                }


                // create interval for loading room every 10 second * 6 times
                let repeat = setInterval(async function() {
                    let counter = await loadRoom()

                    // stop interval if the load room is closed
                    if (counter.flag === 1) {
                        clearInterval(repeat)
                    }

                    // stop interval if until 1 minute there is no room found
                    if (counter.count === 6) {
                        clearInterval(repeat)

                        // back to entrance page
                        res.render('GamePage/entrance', {source: 'loadRoom'})
                    }
                }, 10000)    
            
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}


module.exports = { gameRoomPageController }
