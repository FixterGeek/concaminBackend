const router = require('express').Router()
const Advertisement = require('../models/Advertisement')


router.get('/', (req, res, next)=>{
    Advertisement.aggregate([{$sample:{size:5}}])
        .then(r=>{
            return res.json(r)
        }).catch(e=>next(e))
})

router.post('/', (req, res, next)=>{
    Advertisement.create(req.body)
        .then(r=>{
            return res.json(r)
        }).catch(e=>next(e))
})

module.exports = router