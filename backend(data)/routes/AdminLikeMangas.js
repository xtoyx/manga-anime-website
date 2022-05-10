const express = require('express');
const router = express.Router();
const AdminLikeMangas = require('../models/AdminLikeMangas');


// Get everything as manga
router.get('/', async(req, res) => {
    const tags_re = await AdminLikeMangas.find({});
    res.status(200).json(tags_re);
});

router.post('/add', async(req, res) => {
    if (!await AdminLikeMangas.exists({})) {
        var LikedId=[];
        LikedId.push(req.body.likedid)
        const response = await AdminLikeMangas.create({ Liked: LikedId});
        res.status(200).send({ status: 'Added' });
    } else {
        var liked=[]
        var message='Added to the list';
        liked.push(req.body.likedid);
        var add_to=await AdminLikeMangas.find();
        if(add_to){
            var AddtoList=add_to[0].Liked;
            AddtoList.map((value,index)=>{
                if(value === req.body.likedid){
                    message='exists'
                }
            })
            AddtoList.map((value,index)=>{
                liked.push(value)
            })
            if(message !== 'exists'){
                await AdminLikeMangas.findOneAndUpdate({},{$set:{ Liked:liked}})
            }
            res.status(200).send({ status: message });
        }

    }
});


module.exports = router;