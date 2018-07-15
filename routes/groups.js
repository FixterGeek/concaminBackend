const router = require('express').Router();
const Group = require('../models/Group');
const User = require('../models/User');
const uploadCloud = require('../helpers/cloudinary');
const verifyToken = require('../helpers/jwt').verifyToken;
const jwt = require('jsonwebtoken');
const sendInvite  = require('../helpers/mailer').sendInvite;

router.get('/invite/accept/:token', (req,res)=>{
    //const url = "http://localhost:3001/main/profile"
    const url = "https://concamin-c2a9c.firebaseapp.com/main/profile"
    jwt.verify(req.params.token, 'bliss', function(err, unHashed) {
        if (err) {
            console.log(err)
            return res.send("Tu Invitación expiró")
        }
        console.log('chet?')
        //const unHashed = jwt.decode(req.params.token);
        Group.findOne({_id:unHashed.group, members:{$ne:unHashed.invited}})
        .populate('owner')
        .then(group=>{
                if(!group) return res.send('Ya eres parte de este grupo')
                group.members.push(unHashed.invited);
                return group.save()
        })
        .then(group=>{
            res.send(`
            <h1>Felicidades, ${group.owner.username} te ha hecho miembro!</h1>
            <h2>Ahora eres parte del grupo ${group.name}</h2>
            <h3>Revisa tu perfil! <a href=${url}>Ir</a><h3>
            `)
        })
        .catch(e=>res.send("Algo falló, intentalo de nuevo"))
    });


});

router.post('/invite', verifyToken, (req,res,next)=>{
    //check si el invitado es miembro
    const emails = req.body.emails;
    User.find({email:{$in:emails}})
    .then(users=>{
            for(let u of users){
                if(emails.indexOf(u.email) !== -1){
                    emails.splice(emails.indexOf(u.email),1);
                }
                //gen token
                const token = jwt.sign({
                    invited: u._id,
                    group: req.body.groupId,
                    owner: req.user._id,
                    member: true
                },'bliss',{expiresIn: "15d"});
                //enviamos email 1x1
                sendInvite(token, u.email)
            }
            
        res.json({users, emails});
    })
    .catch(e=>{})
    //en caso de que no 
})

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
        const query = {_id:req.params.id, members:req.user._id}
        Group.findOne(query)
        .populate('members')
        .populate('owner')
        .then(item=>{
            if(!item) return res.status(403).json({message:"No tienes permiso"});
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