// import modules
const JWT = require('jsonwebtoken')
const { LoginModel } = require('../models/loginModels');
const { PasswordEncryption } = require('../lib/passwordEncryption')

class loginPageController {

    // show login Page
    static showLoginPage(req, res) {        
        try{
            const token = req.cookies.token;
            if (token) {
                res.render('pageNotAuthorized')
            } else {
                res.render('RegisterPage/login')
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // Operations upon data validation
    static async runLoginValidation(req, res, next) {
        try {
            // get input from user
            const loginEmail = req.body.email 
            const loginPassword = PasswordEncryption(req.body.password)

            // check if email and password are valid
            const loginResult = await LoginModel.checkLoginValidity(loginEmail, loginPassword, next)

            switch (loginResult) {
                // Case 1: email not found
                case "emailNotFound" :
                    res.render('RegisterPage/loginValidation', {
                        type:"ERROR", 
                        title: "Oops,, we didn't find your email...", 
                        body: "Please sign up or ensure your email is correct !"
                    })
                    break
                

                // Case 2: password is incorrect 
                case "wrongPassword" :
                    res.render('RegisterPage/loginValidation', {
                        type:"ERROR", 
                        title: "Oops,, password is incorrect...", 
                        body: "Please go back and retype your password !"
                    })
                    break


                // Case 3 : user is superadmin
                case "superAdmin":                
                    res.render('RegisterPage/adminValidation')
                    break


                // Case 4: get validation result as an object and user is not superadmin
                default :
                    // create token for user Auth
                    const tokenUser = JWT.sign({
                        id: loginResult.id,
                        username: loginResult.username,
                        avatar: loginResult.avatar
                    }, 
                        process.env.JWT_PASSKEY,
                        {expiresIn: '1d'})

                    // save new login data
                    await LoginModel.saveLoginData(loginResult.id, tokenUser)

                    setTimeout(async function() {
                        // activate cookie 
                        res.cookie('token', tokenUser, { maxAge: 86400000 })

                        // show login Validation page
                        res.render('RegisterPage/loginValidation', {
                            type: "SUCCESS", 
                            username: loginResult.username,
                            avatar: 'images/avatars/' + loginResult.avatar
                        })
                    }, 2000)
            }
            
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }

}


module.exports = { loginPageController }



