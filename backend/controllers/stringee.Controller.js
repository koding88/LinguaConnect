const jwt = require('jsonwebtoken');

const generateToken = (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const API_KEY_SID = process.env.STRINGEE_API_KEY_SID;
        const API_KEY_SECRET = process.env.STRINGEE_API_KEY_SECRET;

        const now = Math.floor(Date.now() / 1000);
        const exp = now + 3600000;

        const header = {
            cty: "stringee-api;v=1"
        };

        const payload = {
            jti: `${API_KEY_SID}-${now}`,
            iss: API_KEY_SID,
            exp: exp,
            userId: userId
        };

        const token = jwt.sign(payload, API_KEY_SECRET, {
            algorithm: 'HS256',
            header: header
        });

        res.json({ access_token: token });
    } catch (error) {
        console.error('Error generating Stringee token:', error);
        res.status(500).json({ message: "Error generating token" });
    }
};

module.exports = {
    generateToken
};
