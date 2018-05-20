const router = require('express').Router();
const Post = require('../models/Post');
const updates = require('../helpers/cloudinary');

function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).json({message:'Inicia sesión primero'})
    }
}

router.post('/', 
    isAuth, 
    updates.single('image'),
    (req,res, next)=>{
        if(req.file) req.body.image = req.file.url;
        req.body.user = req.user._id;
        Post.create(req.body)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
});

router.get('/', 
    isAuth, 
    (req,res)=>{
        Post.find()
        .sort('-created_at')
        .then(posts=>{
            res.json(posts);
        })
        .catch(e=>next(e));
})

router.get('/:id', 
    isAuth, 
    (req,res)=>{
        Post.findById(req.params.id)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
})

router.patch('/:id', 
    isAuth, 
    updates.single('image'),
    (req,res)=>{
        if(req.file) req.body.image = req.file.url;
        Post.findByIdAndUpdate(req.params.id, req.body, {new:true})
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
});

router.delete('/:id', 
    isAuth, 
    (req,res)=>{
        Post.findByIdAndRemove(req.params.id)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
});



module.exports = router;