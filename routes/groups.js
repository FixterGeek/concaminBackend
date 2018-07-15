const router = require('express').Router();
const Group = require('../models/Group');
const uploadCloud = require('../helpers/cloudinary');
const verifyToken = require('../helpers/jwt').verifyToken;


router.get('/own', verifyToken,(req,res,next)=>{
    let skip = 0;
    if(req.query.skip) skip = Number(req.query.skip);
    Group.find({owner:req.user._id})
    .limit(10)
    .skip(skip)
    .populate('members')
    .populate('owner')
    .then(items=>res.json(items))
    .catch(e=>next(e))
});

router.post('/', 
    verifyToken, 
    uploadCloud.single('cover'),
    //uploadCloud.single('image'),
    (req,res, next)=>{

        if(req.file) req.body.cover = req.file.url;
        //extra settings
        req.body.owner = req.user._id;
        req.body.members = [];
        req.body.members.push(req.user._id)
        Group.create(req.body)
        .then(item=>{
            return Group.findById(item._id)
                .populate('owner')
                .populate('members')
        })
        .then(i=>{
            res.json(i);
        })
        .catch(e=>next(e));
});

router.get('/', 
    verifyToken, 
    (req,res,next)=>{
        //chccar if admin
        //req.user.role === "ADMIN"
        const query = {}
        let skip = 0;
        if(req.query.skip) skip = Number(req.query.skip);
        Group.find(query)
        .limit(10)
        .skip(skip)
        .populate('members')
        .populate('owner')
        .sort('-created_at')
        .then(items=>{
            res.json(items);
        })
        .catch(e=>next(e));
})

router.get('/:id', 
    verifyToken, 
    (req,res)=>{
        Group.findById(req.params.id)
        .populate('members')
        .populate('owner')
        .then(item=>{
            res.json(item);
        })
        .catch(e=>next(e));
})

router.patch('/:id', 
    verifyToken, 
    uploadCloud.single('cover'),
    (req,res)=>{
        if(req.file) req.body.cover = req.file.url;
        Group.findByIdAndUpdate(req.params.id, req.body, {new:true})
        .then(item=>{
            res.json(item);
        })
        .catch(e=>next(e));
});

router.delete('/:id', 
    verifyToken, 
    (req,res)=>{
        Group.findByIdAndRemove(req.params.id)
        .then(item=>{
            res.json(item);
        })
        .catch(e=>next(e));
});



module.exports = router;