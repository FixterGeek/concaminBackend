const router = require('express').Router();
const Post = require('../models/Post');
const Group = require('../models/Group');
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

        if(req.body.tipo === "GROUP"){
            if(!req.body.group) return res.status(404).json({message:"No se encontró"});
            return Group.findOne({members:req.user._id})
            .then(group=>{
                if(!group || group._id != req.body.group) return res.status(403).json({message:"No tienes permiso"});
                return Post.create(req.body)
            })
            .then(post=>{
                return Post.findById(post._id).populate('user')
            })
            .then(p=>{
                res.json(p);
                return;
            })
            .catch(e=>next(e));
            
        }

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
        if(req.query.tipo === "GROUP") {
            if(!req.query.group) return res.status(404).json({message: "No se encontró"})
            //checar si es miembro
            Group.findOne({_id:req.query.group, members:req.user._id})
            .then(group=>{
                if(!group) return res.status(403).json({message:"No tienes permsiso"});
                query.group = req.query.group;
                query.tipo = "GROUP";
                return Post.find(query)
                .limit(10)
                .skip(skip)
                .populate('user')
                .sort('-created_at')
                .then(posts=>{
                    return res.json(posts);
                })
                .catch(e=>next(e));
            })
            

            //query.members = req.user._id
            return;
        }

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
    (req,res, next)=>{
        Post.findById(req.params.id)
        .then(post=>{
            res.json(post);
        })
        .catch(e=>next(e));
})

router.patch('/like', (req, res, next)=>{
    console.log(req.body)

    Post.findByIdAndUpdate(req.body._id, {$push:{likes:req.body.user}})
        .then(r=>{
            console.log(r, 'liked')
            res.json(r)
        }).catch(e=>{
            console.log(e)
            next(e)
    })

})

router.patch('/:id', 
    verifyToken, 
    uploadCloud.single('image'),
    (req,res, next)=>{
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