require('dotenv').config()
const JWT = require('jsonwebtoken')

const tokenSuperAdmin = JWT.sign({
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD
    }, 
    process.env.JWT_PASSKEY,
    {expiresIn: '1d'})

console.log(tokenSuperAdmin)