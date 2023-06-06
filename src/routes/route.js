const express = require('express');
const router = express.Router();

const { createUrl, getUrl } = require('../controllers/urlController');

router.get('/', (req, res) => {
    res.send('Welcome to URLShortener!');
});

router.post('/url/shorten', createUrl);
router.get('/:urlCode', getUrl);

module.exports = router;