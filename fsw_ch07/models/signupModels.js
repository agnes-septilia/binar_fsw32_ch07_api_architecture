// import modules
const fs = require('fs')
const { userGamesModel } = require('../models_db/index')
const { Sequelize } = require('sequelize')

// get library to create absolute file path
const {resolve} = require('path');
const filePath = resolve(); 


class SignupModel {

    // create function to get customer's email 
    static async checkEmail(email) {
        try{
            const data = await userGamesModel.findOne({ 
                attributes: ['email'] ,
                where: { email }, 
                raw: true 
            })
            console.log("data:", data)
            return data
        } catch(error) {
            console.log(error)
            return error
        }
    }

    // create function to save avatar from user
    static async saveAvatar(files) {
        try{
            const filetype = files.avatar.mimetype

            if (filetype.substring(0, 5) === "image") {    // condition if customer upload new image
                // get the image path
                const oldPath = files.avatar.filepath ;
                const newPath = filePath + '/public/images/avatars/' + files.avatar.newFilename + '.png'

                // save the image in the local
                fs.copyFile(oldPath, newPath, function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Image saved on public folder")
                    }
                })

                return files.avatar.newFilename + '.png'

            } else {     // condition if customer do not upload new image
                return 'avatar.png'
            }
        } catch(error) {
            console.log(error)
            return error
        }
    }


    // create function to save data to db
    static async saveToDatabase(fields, files, password){
        try{
            // save avatar on public folder
            let avatarLink = await this.saveAvatar(files)

            // send sign up data to database
            await userGamesModel.create(
                {
                    username: fields.username,
                    email: fields.email,
                    password: password,
                    avatar: avatarLink,
                    createdAt: Sequelize.literal('NOW()')
                }
            )

        } catch(error) {
            console.log(error)
            return error
        }
    }
 
}


module.exports = { SignupModel }