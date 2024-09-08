const speakeasy = require('speakeasy');

const generateTotpSecret = () => {
    try{
        const secret = speakeasy.generateSecret({length: 20});

        const token =  speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            digits: 6
        })

        return {secret: secret.base32, token}
    }catch(error){
        throw new Error(`Generate TOTP secret error: ${error.message}`);
    }
}

const verifyTotpToken = (secret, otp) => {
    try{
        console.log("secret: ", secret);
        console.log("otp: ", otp);
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            digits: 6,
            window: 1
        })
        console.log("verified: ", verified);
        return verified;
    }catch(error){
        throw new Error(`Verify TOTP token error: ${error.message}`);
    }
}

module.exports = {generateTotpSecret, verifyTotpToken}