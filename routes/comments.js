const router = require('express').Router();
const Comment = require('../models/Comment');
const verifyToken = require('../helpers/jwt').verifyToken;

router.post('/',
    verifyToken,
    (req, res, next)=>{
    //req.body.user = req.user._id;
    req.body.user = '5b0246676c645a0014f9fa9d';
    Comment.create(req.body)
        .then(item=>{
            Post.findByIdAndUpdate(item.post, {$push:{comments:item.id}})
            return Comment.findById(item._id).populate('user')

        }).then(item=>{
            return res.json(item)
    })
        .catch(err=>{
            console.log(err)
            return next(err)
        })
})

router.get('/',
    verifyToken,
    (req, res, next)=>{

    let skip = 0;
    if(req.query.skip) skip = Number(req.query.skip);
    Comment.find({post:req.query.post})
        .limit(10)
        .skip(skip)
        .populate('user')
        .sort('-created_at')
        .then(items=>{
            return res.json(items)
        })
        .catch(err=>next(err))
})


module.exports = router;
