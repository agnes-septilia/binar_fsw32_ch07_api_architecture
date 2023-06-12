// import modules
const { userProfileModel } = require('../models/userProfileModel')
const { tokenCheck } = require('../lib/TokenCheck')


class userProfilePageController {

    // show view Profile Page
    static async showProfilePage(req, res) {
        try{
            // get id from token
            const token = await tokenCheck(req, res)
            const userId = token.id

            // get user biodata from token
            let userdata = await userProfileModel.getBiodata(userId)
            userdata.avatar = '/images/avatars/' + userdata.avatar

            // get user game history
            let userGameData = await userProfileModel.getGameHistory(userId)

            // show profile page with isUpdated is false
            res.render('ProfilePage', {userdata, userGameData, isUpdated: false})

        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // show edit Profile Page
    static async showEditProfilePage(req, res) {
        try{
            // get id from token
            const token = await tokenCheck(req, res)
            const userId = token.id

            // get user biodata from token
            let userdata = await userProfileModel.getBiodata(userId)
            userdata.avatar = '/images/avatars/' + userdata.avatar

            // show profile page with isUpdated is true
            res.render('ProfilePage', {userdata, isUpdated: true})
            
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // show user updated Profile Page
    static async updatedProfilePage(req, res) {        
        try {
            // get input from req.body
            const { editProfileButton:userId, ...rest} = req.body
            const oldData = await userProfileModel.getBiodata(userId)


            // check if this is the first submission of biodata
            let isNew = true 
            for (var key in oldData) {

                // if old data are found, then it's not new submission
                if (key in {...rest} && (oldData[key] !== null || '')) {
                    isNew = false
                    break
                }  
            }
            

            // create new list of updated value. 
            let newData = {}
            for (var newKey in {...rest}){
                for (var oldKey in oldData) {
                    if (newKey === oldKey) {

                        // if new data is available, then use new data
                        if ({...rest}[newKey] !== '') {
                            newData[newKey] = {...rest}[newKey]
                        } 

                        // if no new data available but we have old data, then use old data
                        else if ({...rest}[newKey] === '' && (oldData[oldKey] !== null || '')) {
                            newData[newKey] = oldData[oldKey]
                        } 
                        
                        // otherwise, leave as null
                        else {
                            newData[newKey] = ''
                        }
                    } 
                }
            }

            
            // save or update database table 
            switch (isNew) {
                case true:            
                    await userProfileModel.createNewBiodata(userId, newData)
                    break

                case false:
                    await userProfileModel.saveToBiodata(userId, newData)
                }

            
            // redirect to profile page
            setTimeout(async function() {
                // get user biodata
                let userdata = await userProfileModel.getBiodata(userId)
                userdata.avatar = '/images/avatars/' + userdata.avatar

                // get user game history
                let userGameData = await userProfileModel.getGameHistory(userId)

                // show profile page
                res.render('ProfilePage', {userdata, userGameData, isUpdated: false})

            }, 2000)
        
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }

}


module.exports = { userProfilePageController }