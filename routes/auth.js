const router = require('express').Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const passport = require('passport');
const uploads = require('../helpers/cloudinary');
const genToken = require('../helpers/jwt').genToken;
const verifyToken = require('../helpers/jwt').verifyToken;



function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).json({message:"inicia sesión primero"})
    }
}

router.post('/skills', 
verifyToken,
(req,res, next)=>{
    console.log(req.body)
    req.body.user = req.user._id
    Skill.create(req.body)
    .then(skill=>{
        res.status(201).json(skill)
    })
    .catch(e=>{
        next(e)
    })
}
)


router.get('/skills/:id', verifyToken,
(req,res)=>{
    Skill.find({user:req.user._id})
    .then(skills=>{
        res.status(200).json(skills)
    })
    .catch(e=>{
        next(e)
    })
}
)

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
(req,res,next)=> {
    passport.authenticate('local', (err, user, info) => {
        console.log(err)
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send(info);

        //pido los posts

        Post.find({user: user._id, tipo: "PERSONAL"})
            .limit(10)
            .populate('user')
            .then(posts => {
                user.posts = posts;
                res.json({user: user, access_token: genToken(user)});
            })
            .catch(err => {
                console.log(err)

                //Skill.find({user:user._id})
                //.limit(10)
                //.populate('user')
                //.then(skills=>{
                //  user.skills = skills;

                res.json({user: user, access_token: genToken(user)});
                //})
                //.catch(err=>{
                //  res.json({user:user,access_token:genToken(user)});
                // })

            })(req, res, next);
    })
})

router.get('/logout', (req,res)=>{
    req.logout();
    res.json({message:'loggedOut'})
})

router.post('/profile', 
verifyToken, 
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
    .then(user=>{
        res.json(user);
    })
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