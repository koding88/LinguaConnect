const speakeasy = require('speakeasy');

const generateTotpSecret = () => {
    try {
        const secret = speakeasy.generateSecret({length: 20});

        const token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            digits: 6
        })

        return {secret: secret.base32, token}
    } catch (error) {
        throw new Error(`Generate TOTP secret error: ${error.message}`);
    }
}

const verifyTotpToken = (secret, otp) => {
    try {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            digits: 6,
            window: 1
        })
        return verified;
    } catch (error) {
        throw new Error(`Verify TOTP token error: ${error.message}`);
    }
}

const enable2FA = () => {
    try {
        const secret = speakeasy.generateSecret({
            name: 'Lingua Connect',
            length: 20,
            otpauth_url: true
        });
        return {secret: secret.base32, otp_url: secret.otpauth_url};
    } catch (error) {
        throw new Error(`Enable 2FA error: ${error.message}`);
    }
}

const verify2FA = (secret, otp) => {
    try {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: otp,
            digits: 6,
            window: 1
        })
        return verified;
    } catch (error) {
        throw new Error(`Verify 2FA error: ${error.message}`);
    }
}

module.exports = {generateTotpSecret, verifyTotpToken, enable2FA, verify2FA}