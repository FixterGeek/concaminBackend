const router = require('express').Router();
const Post = require('../models/Post');
const uploadCloud = require('../helpers/cloudinary');
const verifyToken = require('../helpers/jwt').verifyToken;


function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).json({message:'Inicia sesión primero'})
    }
}

router.get('/own', verifyToken,(req,res,next)=>{
    let skip = 0;
    if(req.query.skip) skip = Number(req.query.skip);
    Post.find({user:req.user._id, tipo:'PERSONAL'})
    .limit(10)
    .skip(skip)
    .populate('user')
    .then(items=>res.json(items))
    .catch(e=>next(e))
});

router.post('/', 
    verifyToken, 
    uploadCloud.fields([
        {name:'image', maxCount:1, require:false},
        {name: 'file', maxCount:1, require:false}
    ]),
    //uploadCloud.single('image'),
    (req,res, next)=>{

        if(req.files.image) req.body.image = req.files.image[0].url;
        if(req.files.file) req.body.file = req.files.file[0].url;

        //extra settings
        if(req.body.links) req.body.links = req.body.links.split(',');
        else delete req.body.links;
        req.body.user = req.user._id;

        Post.create(req.body)
        .then(post=>{
            return Post.findById(post._id).populate('user')
        })
        .then(p=>{
            res.json(p);
        })
        .catch(e=>next(e));
});

router.get('/', 
    verifyToken, 
    (req,res,next)=>{
        const query = {tipo:'PERSONAL'}
        let skip = 0;
        if(req.query.skip) skip = Number(req.query.skip);
        if(req.query.tipo) query.tipo = req.query.tipo;
        Post.find(query)
        .limit(10)
        .skip(skip)
        .populate('user')
        .sort('-created_at')
        .then(posts=>{
            res.json(posts);
        })
        .catch(e=>next(e));
})

router.get('/:id', 
    verifyToken, 
    (req,res)=>{
        Post.findById(req.params.id)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
})

router.patch('/:id', 
    verifyToken, 
    uploadCloud.single('image'),
    (req,res)=>{
        if(req.file) req.body.image = req.file.url;
        Post.findByIdAndUpdate(req.params.id, req.body, {new:true})
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
});

router.delete('/:id', 
    verifyToken, 
    (req,res)=>{
        Post.findByIdAndRemove(req.params.id)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
});



module.exports = router;