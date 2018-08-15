const router = require('express').Router()
const Advertisement = require('../models/Advertisement')
const uploadCloud = require('../helpers/cloudinary');
const verifyToken = require('../helpers/jwt').verifyToken;


router.get('/', verifyToken, (req, res, next)=>{
    console.log(req.query)
    if(req.query.mode=='all'){
        Advertisement.find().sort('-created_at')
            .then(r=>{
                return res.json(r)
            }).catch(e=>next(e))
    }else{
        Advertisement.aggregate([{$match:{toPublish:true}}, {$sample:{size:10}}])
            .then(r=>{
                return res.json(r)
            }).catch(e=>next(e))
    }

})

router.post('/', verifyToken,
    uploadCloud.fields([
        {name:'image', maxCount:1, require:false}
    ]),
    (req, res, next)=>{

        if(req.files.image) req.body.image = req.files.image[0].url;

        Advertisement.create(req.body)
            .then(r=>{
                return res.json(r)
            }).catch(e=>{
                console.log(e)
                next(e)
        })
})

router.delete('/:id', verifyToken,(req, res, next)=>{
    Advertisement.findOneAndRemove(req.params.id)
        .then(r=>{
            return res.json(r)
        }).catch(e=>{
            next(e)
    })
})

router.patch('/:id', verifyToken,(req, res, next)=>{
    console.log(req.body)
    Advertisement.findOneAndUpdate(req.params.id,req.body, {new:true})
        .then(r=>{
            return res.json(r)
        }).catch(e=>{
            next(e)
    })
})

module.exports = router