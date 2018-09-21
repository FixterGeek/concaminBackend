const router = require('express').Router();
const Event = require('../models/Event');
const User = require('../models/User');
const uploadCloud = require('../helpers/cloudinary');
const verifyToken = require('../helpers/jwt').verifyToken;
const jwt = require('jsonwebtoken');
const sendInvite  = require('../helpers/mailer').sendInvite;
const sendInviteNonMember = require('../helpers/mailer').sendInviteNonMember



router.get('/own', verifyToken,(req,res,next)=>{
    let skip = 0;
    const query = {$or:[{owner:req.user._id},{members:req.user._id}]};
    if(req.query.skip) skip = Number(req.query.skip);
    Group.find(query)
    .limit(10)
    .skip(skip)
    .populate('members')
    .populate('owner')
    .then(items=>res.json(items))
    .catch(e=>next(e))
});


//add event
router.post('/', 
    verifyToken, 
    uploadCloud.single('cover'),
    //uploadCloud.single('image'),
    (req,res, next)=>{

        if(req.file) req.body.cover = req.file.url;
        //extra settings
        req.body.owner = req.user._id;
        // req.body.members = [];
        // req.body.members.push(req.user._id)
        Event.create(req.body)
        .then(item=>{
            return Event.findById(item._id)
                .populate('owner')
                .populate('posts')
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
        Event.find(query)
        .limit(10)
        .skip(skip)
        .populate('participants')
        .populate('posts')
        .populate('owner')
        .sort('-created_at')
        .then(items=>{
            res.json(items);
        })
        .catch(e=>next(e));
})

//obtener evento en particular
router.get('/:id', 
    verifyToken, 
    (req,res)=>{
        // const query = {_id:req.params.id}
        Event.findById(req.params.id)
        .populate('posts')
        .populate('owner')
        .populate('participants')
        .then(item=>{
            if(!item) return res.status(404).json({message:"No se encontró"});
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


//Borrar evento
router.delete('/:id', 
    verifyToken, 
    (req,res)=>{
        Event.findByIdAndRemove(req.params.id)
        .then(item=>{
            res.json(item);
        })
        .catch(e=>next(e));
});

//asistir al evento
router.post('/:id/assist', 
    verifyToken,
    (req,res)=>{
        //si ya existe hay que sacarlo
        //Event.findByIdAndUpdate(req.params.id, {$addToSet:{participants:req.user._id}})
        Event.findOne({_id:req.params.id, participants:req.user._id})
        .then(event=>{
            if(!event){
                Event.findByIdAndUpdate(req.params.id, {$addToSet:{participants:req.user._id}}, {new:true})
                    .populate('posts')
                    .populate('owner')
                    .populate('participants')
                    .then(event=>{
                        return res.status(200).json(event)
                    })
                    
            }
            Event.findByIdAndUpdate(req.params.id, {$pull:{participants:req.user._id}}, {new:true})
                .populate('posts')
                .populate('owner')
                .populate('participants')
                .then(event=>{
                    return res.status(200).json(event)
                })
            
        })
        .catch(e=>next(e))
    }
)



module.exports = router;