// import modules
const { GamePlayModel } = require('../../models/gameModels/gamePlayModel')


class gamePlayPageController {



    // function to show game result
    static async showGameResult(req, res) {
        try{
            let weapon = ''
            let parsedPlayerInfo = {}  // parsedPlayerInfo will catch all carried-on information about player


            // check which weapon is selected
            switch (true){
                case 'rock' in req.body:
                    weapon = 'rock'
                    parsedPlayerInfo = JSON.parse(req.body.rock)
                    break
                case 'paper' in req.body:    
                    weapon = 'paper'
                    parsedPlayerInfo = JSON.parse(req.body.paper)
                    break
                case 'scissors' in req.body:
                    weapon = 'scissors'
                    parsedPlayerInfo = JSON.parse(req.body.scissors)
            }


            // send the user data and weapon selected to database 
            GamePlayModel.sendUserWeapon(
                    parsedPlayerInfo.roomId,
                    parsedPlayerInfo.userId,
                    parsedPlayerInfo.round,
                    weapon
                )    


            // this is the function to be run if the opponent have data
            async function match(weapon, opponent, parsedPlayerInfo) {
                try {
                    // calculate the result
                    let calculation = {}

                    if (weapon === opponent) {
                        calculation = {result:'draw', score: 1}
                    } 
                    
                    else if ((weapon === 'rock' && opponent === 'paper')
                        || (weapon === 'paper' && opponent === 'scissors')
                        || (weapon === 'scissors' && opponent === 'rock')) {
                            calculation = {result:'lose', score: 0}
                    }
                    
                    else if ((weapon === 'rock' && opponent === 'scissors')
                        || (weapon === 'paper' && opponent === 'rock')
                        || (weapon === 'scissors' && opponent === 'paper')) {
                            calculation = {result:'win', score: 2}
                    }

                    // update calculation result to database
                    GamePlayModel.updateGame(
                        parsedPlayerInfo.roomId,
                        parsedPlayerInfo.userId,
                        parsedPlayerInfo.round,
                        calculation.result,
                        calculation.score
                    )


                    // send the result back to FE
                    res.render('GamePage/result', {
                        playerInfo : parsedPlayerInfo,
                        weapon,
                        opponentWeapon: opponent,
                        result: calculation.result
                    })
                } catch(error) {
                    console.log(error)
                    res.status(500).render('error')
                }
            }



            // to check opponent's weapon, create loop condition until we get opponent data
            let loop = 0

            // loop the searching opponent weapon function
            async function doLooping(weapon,parsedPlayerInfo) {
                let repeat = setInterval(async function() {
                    const data = await GamePlayModel.getOpponentWeapon(
                        parsedPlayerInfo.roomId, 
                        parsedPlayerInfo.round, 
                        parsedPlayerInfo.opponentUserId
                        )
                    loop ++ 
                    
                    if (loop === 12 && data === null) {
                        clearInterval(repeat)
                        res.render('GamePage/entrance', {source: 'leaveRoom'})
                    }

                    if (data !== null) {
                        clearInterval(repeat)
                        await match(weapon, data.weapon, parsedPlayerInfo)
                    }  
                }, 5000)
            }

            const opponent = await doLooping(weapon, parsedPlayerInfo)
        
            
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // function to show next round game
    static async nextRoundGame(req, res) {
        try{
            // get info from parsed data, and add the round 
            const parsedPlayerInfo = JSON.parse(req.body.nextRound)
            parsedPlayerInfo.round++

            // if round is <= 3 , then go to next round
            if (parsedPlayerInfo.round <= 3) {
                res.render('GamePage', {playerInfo: parsedPlayerInfo})
            } 
            
            // if round > 3, game over, go to see final match result
            else {
                // calculate summary of game
                const match = await GamePlayModel.calculateResult(parsedPlayerInfo.roomId, parsedPlayerInfo.userId)

                let finalScore = 0
                let opponentScore = 0
                let finalMatch = ''

                switch(true) {
                    // Case 1: calculate result if user is P1
                    case parsedPlayerInfo.userId === match.user_id_one :
                        finalScore = Number(match.player_score_one)
                        opponentScore = Number(match.player_score_two)

                        if (finalScore > opponentScore) {
                            finalMatch = 'win'
                        } else if (finalScore < opponentScore) {
                            finalMatch ='lose'
                        } else {
                            finalMatch ='draw'
                        }
                        break
                    
                    // Case 2: calculate result if user is P2
                    case parsedPlayerInfo.userId === match.user_id_two :
                        finalScore = Number(match.player_score_two)
                        opponentScore = Number(match.player_score_one)

                        if (finalScore > opponentScore) {
                            finalMatch ='win'
                        } else if (finalScore < opponentScore) {
                            finalMatch ='lose'
                        } else {
                            finalMatch ='draw'
                        }                   
                }

                // deactivate the room
                GamePlayModel.deactivateRoom(parsedPlayerInfo.roomId)

                // go back to entrance with the game result
                res.render('GamePage/entrance', {
                    source: 'gameOver',
                    playerInfo: parsedPlayerInfo,
                    finalMatch
                })
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}



module.exports = { gamePlayPageController }