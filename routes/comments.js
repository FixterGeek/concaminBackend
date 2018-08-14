const router = require('express').Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post')
const verifyToken = require('../helpers/jwt').verifyToken;

router.post('/',
    verifyToken,
    (req, res, next)=>{
    console.log('el comment', req.body)
    req.body.user = req.user._id;

    Comment.create(req.body)
        .then(item=>{

            return Comment.findById(item._id).populate('user')
            //Promise.all([Post.findByIdAndUpdate(item.post, {$push:{comments:item.id}}),])

        }).then(item=>{
            return res.json(item)
    })
        .catch(err=>{
            //console.log(err)
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
        .sort('created_at')
        .then(items=>{
            return res.json(items)
        })
        .catch(err=>next(err))
})


router.delete('/:id',
    verifyToken,
    (req,res)=>{
        Comment.findByIdAndRemove(req.params.id)
            .then(item=>{
                res.json(item);
            })
            .catch(e=>next(e));
    });



module.exports = router;
