const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const uploads = require('../helpers/cloudinary');

function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).json({message:"inicia sesión primero"})
    }
}

router.post('/signup', (req,res)=>{
    User.register(req.body, req.body.password, (err, user)=>{
        if(err) return res.status(500).json(err);
        res.json(user);
    })
});

router.post('/login',
 passport.authenticate('local'), 
 (req,res)=>{
    res.json(req.user);
});

router.get('/logout', (req,res)=>{
    req.logout();
    res.json({message:'loggedOut'})
})

router.post('/profile/:id', 
isAuth, 
uploads.single('profilePic'),
(req,res, next)=>{
    if(req.file) req.body.profilePic = req.file.url;
    User.findByIdAndUpdate(req.params.id, req.body)
    .then(user=>res.json(user))
    .catch(e=>next(e));
})

module.exports = router;