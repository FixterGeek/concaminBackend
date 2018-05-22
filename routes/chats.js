const router = require('express').Router();
const Chat = require('../models/Chat');
//const updates = require('../helpers/cloudinary');

function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).json({message:'Inicia sesión primero'})
    }
}


router.get('/', 
    // isAuth, 
    (req,res, next)=>{
        //return res.send("bliss")

        if(req.query.userId){
            const {userId} = req.query;
            Chat.findOne({participants:{$in:[userId]}})
            .then(chat=>{
                if(!chat) {
                    const newChat = {};
                    newChat['participants'] = [userId, req.user._id];
                    return Chat.create(newChat)
                }
                return chat;
            })
            .then(chat=>{
                return res.json(chat);
            })
            .catch(e=>next(e))
        }

})

router.get('/:id', 
    //isAuth, 
    (req,res)=>{
        Chat.findById(req.params.id)
        .then(chat=>{
            res.json(chat);
        })
        .catch(e=>next(e));
});

router.post('/:id', 
isAuth,
(req,res,next)=>{
    console.log("user", req.user);

    const {id} = req.params;
    //console.log(req.body)
    Chat.findByIdAndUpdate(id, {$push:{messages:req.body}}, {new:true})
    .then(chat=>{
        res.json(chat);
    })
    .catch(e=>next(e));

});



 module.exports = router;