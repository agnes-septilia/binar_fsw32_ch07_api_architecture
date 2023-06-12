const CryptoJS = require ("crypto-js");

function PasswordEncryption(password) {
    try {
        const encryptedPassword = CryptoJS.HmacSHA256(password, `${process.env.HMAC_PASSKEY}`).toString()
        return encryptedPassword
    } catch(error) {  
        console.log(error)
        return error
    }
}

module.exports = { PasswordEncryption }