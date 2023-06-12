// import modules
const { AdminModel } = require('../models/adminModels');
const { PasswordEncryption } = require('../lib/passwordEncryption')

class adminPageController {

    // show admin page by method get --> need to validate that token is for superuser
    static async validateAdmin(req, res) {
        try{
            const token = req.cookies.token;

            if (token === undefined) {
                res.render('RegisterPage/login')
            } else if ( token !== process.env.SUPERADMIN_TOKEN) {
                res.render('pageNotAuthorized')
            } else {
                // get list of user data
                const userdata = await AdminModel.allData()
                res.render('AdminPage', {userdata, alert:false})
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // show admin page by method post
    static async showAdminPage(req, res) {
        try{
            switch(true) {
                // Source 1: Admin page is accessed from token validation page 
                case 'enterButton' in req.body :
                    if (req.body.token !== process.env.SUPERADMIN_TOKEN) {
                        res.render('RegisterPage/login')
                    } else {
                        const userdata = await AdminModel.allData()
                        res.render('AdminPage', {userdata, alert:false})
                    }

                    break



                // Source 2: Admin page is refreshed after new data added
                case 'addButton' in req.body :
                    const newUser = req.body

                    // check if email is available
                    const checkEmail = await AdminModel.checkEmail(newUser.email)
                    
                    // failed if the email is found in db
                    if (checkEmail !== null) {
                        const userdata = await AdminModel.allData()

                        res.render('AdminPage', {
                            userdata, 
                            alert: true,
                            type: 'danger',
                            message: "Adding new data failed. Email has been registered !"
                        })
                    } 
                    
                    // continue if the email is not found in db
                    else {
                        // encrypt the password --> update value in newUser
                        const encryptPassword = PasswordEncryption(req.body.password)
                        newUser.password = encryptPassword;

                        // save new data to database
                        await AdminModel.addData(newUser)

                        // get updated data list
                        setTimeout(async function() {
                            const userdata = await AdminModel.allData()
                            res.render('AdminPage', {
                                userdata, 
                                alert: true,
                                type: 'success',
                                message: "New data has been successfully added !"})
                        }, 2000)
                    }

                    break



                // Source 3: Admin page is refresh after data edited
                case 'editButton' in req.body:
                    // get input from req.body --> editButton saves the information of userid
                    const userId = req.body.editButton

                    // check if this is the first submission of biodata
                    const oldBiodata = await AdminModel.getOldBiodata(userId)
                    
                    // if no data in biodata --> assign user Id as new data
                    if (oldBiodata === null) {
                        await AdminModel.createNewBiodata(userId)
                    }
                    
                    // update data by id 
                    setTimeout(async function() {
                        await AdminModel.editData(req.body)
                    
                        // get updated data list
                        setTimeout(async function() {
                            const userdata = await AdminModel.allData()
                            res.render('AdminPage', {
                                userdata, 
                                alert: true,
                                type: 'success',
                                message: "Data has been successfully updated !"})
                        }, 2000)
                    }, 2000)

                    break

                
                // Source 4: Admin page is refresh after data deleted
                case 'deleteButton' in req.body:
                    // get id from req.body --> deleteButton saves the information of userid
                    const user_id = req.body.deleteButton

                    // check if user have existing data in table rooms
                    const oldRoomData = await AdminModel.getRoomData(user_id) 

                    // if user have played the games, we can only delete the biodata
                    if (oldRoomData !== null) {
                        await AdminModel.deleteBiodata(user_id)
                    }

                    // if user haven't played the games, we can delete data in all tables
                    else {
                        await AdminModel.deleteAllData(user_id)
                    }

                    // get updated data list
                    setTimeout(async function() {
                        const userdata = await AdminModel.allData()
                        res.render('AdminPage', {
                            userdata, 
                            alert: true,
                            type: 'success',
                            message: "Data has been successfully deleted !"})
                    }, 2000)                    
            }
            

        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}

module.exports = { adminPageController }