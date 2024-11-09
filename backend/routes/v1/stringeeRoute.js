const express = require('express');
const router = express.Router();
const { generateToken } = require('../../controllers/stringee.Controller');

router.get('/generate-token', generateToken);

module.exports = router;
