const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    obj = {
        title: 'Login / route',
        data: 'Login is sending data'
    };
    res.json(obj);
})

module.exports = router;