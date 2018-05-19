const router = require('express').Router();
const User = require('../models/User');

router.post('/signup', (req,res)=>{
    User.register(req.body, req.body.password, (err, user)=>{
        if(err) return res.status(500).json(err);
        res.json(user);
    })
});

module.exports = router;