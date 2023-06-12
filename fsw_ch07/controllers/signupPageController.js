// import modules
const formidable = require('formidable')
const { SignupModel } = require('../models/signupModels');
const { PasswordEncryption } = require('../lib/passwordEncryption')

class signupPageController {

    // show sign up Page
    static showSignUpPage(req, res) {
        try{
            // sign up page is only accessible if user didn't have active token
            const token = req.cookies.token;
            if (token) {
                res.render('pageNotAuthorized')
            } else {
                res.render('RegisterPage/signup')
            }
        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }


    // Operations upon data validation
    static async runSignupValidation(req, res) {
        try {
            const form = formidable({ multiples: true })

            form.parse(req, async (err, fields, files) => {  
                // encrypt the passwords
                const encryptInitPassword = PasswordEncryption(fields.initialPassword)
                const encryptReconfirmPassword = PasswordEncryption(fields.reconfirmPassword) 

                // check if email has been registered 
                const checkedEmail = await SignupModel.checkEmail(fields.email)    


                switch (true) {
                    // do not proceed if email is found
                    case checkedEmail !== null:
                        res.render('RegisterPage/signupValidation', {
                            type:"ERROR", 
                            title: "Oops,, the email has been registered...", 
                            body: "Please use another email address !"
                        })
                        break

                    // do not proceed if the password is not match
                    case encryptInitPassword !== encryptReconfirmPassword:
                        res.render('RegisterPage/signupValidation', {
                            type:"ERROR",
                            title: "Oops,, the passwords are not match...",
                            body: "Please make sure both passwords are match !"
                        })
                        break

                    // proceed if all validation passed
                    default:
                        // save data to database
                        await SignupModel.saveToDatabase(fields, files, encryptInitPassword)

                        // show signup Validation page 
                        res.render('RegisterPage/signupValidation', {
                            type:"SUCCESS", 
                            title: "Horray !!!",
                            body: "You've successfully registered !"
                        })
                }               
                    
            })

        } catch(error) {
            console.log(error)
            res.status(500).render('error')
        }
    }
}


module.exports = { signupPageController }



