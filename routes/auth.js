const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const passport = require('passport');
const uploads = require('../helpers/cloudinary');
const genToken = require('../helpers/jwt').genToken;



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
        passport.authenticate('local')(req,res, ()=>{
            console.log(req.user)
            res.json({user:req.user,access_token:genToken(user)});
        });
        
    })
});

router.post('/login',
// passport.authenticate('local'), 
(req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{
        console.log(err)
        if(err) return res.status(500).send(err);
        if(!user) return res.status(500).send(info);

        //pido los posts
        Post.find({user:user._id})
        .populate('user')
        .then(posts=>{
            user.posts = posts;
            res.json({user:user,access_token:genToken(user)});
        })
        .catch(err=>{
            res.json({user:user,access_token:genToken(user)});
        })
        
    })(req, res, next);
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
    //res.json(req.user);

    User.findById(req.user._id)
        .populate('following')
        .then(user=>res.json(user))
});

module.exports = router;