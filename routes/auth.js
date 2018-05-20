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

router.get('/users/:id', isAuth, (req,res)=>{
    const promise = Promise.all([User.findById(req.user._id), User.findById(req.params.id)]);
    promise
    .then(results=>{
        if(results[0] in results[1].followers){
            results[1].follow = true;
        }else{
            results[1].follow = false;
        }
        res.json(results[1]);
    })
    .catch(e=>next(e))
});

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

router.post('/profile', 
isAuth, 
uploads.fields([{name:"profilePic", maxCount:1}, {name:"cover", maxCount:1}]),
(req,res, next)=>{
    console.log(req.body)
    if(req.files.profilePic) {
        req.body.profilePic = req.files.profilePic[0].url;
    }else{
        delete req.body.profilePic;
    }
    if(req.files.cover ){
        req.body.cover = req.files.cover[0].url;
    }else{
        delete req.body.cover;
    }

    User.findByIdAndUpdate(req.user._id, req.body, {new:true})
    .then(user=>res.json(user))
    .catch(e=>next(e));
});

router.get('/logged', 
isAuth,
 (req,res)=>{
    res.json(req.user);
    // User.findOne()
    // .then(user=>res.json(user))
});

module.exports = router;