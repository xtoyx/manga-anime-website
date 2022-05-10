const express = require('express');
const router = express.Router();
const CommentsH = require('../models/comments');


// Get everything as manga
router.get('/', async(req, res) => {
    const tags_re = await CommentsH.find();
    res.status(200).json(tags_re);
});

// Add Comment
router.post('/add', async(req, res) => {
    const comment = req.body.commentdata;
    const username = req.body.username;
    const picture = req.body.pictureLink;
    const Manga = req.body.Manga;
    var Replyto = req.body.Replyto;
    const HowMany = req.body.HowMany;
    if (Replyto == null) {
        var okk = {
            username: username,
            PictureLink: picture,
            commentdata: comment,
            NameforManga: Manga,
            HowMany: HowMany,
        }
        const Comment = await CommentsH.create(okk)
        const saved = await Comment.save();
        if (saved) {
            res.status(200).json({ message: 'ok' })
        }
    } else {
        var okk = {
            username: username,
            PictureLink: picture,
            commentdata: comment,
            NameforManga: Manga,
            Replyto: Replyto,
            HowMany: HowMany,
        }
        const Comment = await CommentsH.create(okk)
        const saved = await Comment.save();
        if (saved) {
            res.status(200).json({ message: 'ok added reply' })
        }
    }
});

// find a manga comment
router.post('/find/', async(req, res) => {
    try {
        const sort = { '_id': -1 }
        const tags_re = await CommentsH.find({ 'NameforManga': req.body.title, 'HowMany': req.body.idk }).sort(sort);
        res.status(200).json(tags_re);
    } catch (err) { console.log(err) }
});

router.post('/findbyid/', async(req, res) => {
    try {
        const sort = { '_id': -1 }
        const tags_re = await CommentsH.findOne({ _id: req.body.id }).sort(sort);
        res.status(200).json(tags_re);
    } catch (err) { console.log(err) }
});
// find a manga comment
router.post('/length', async(req, res) => {
    try {

        const tags_re = await CommentsH.find({ 'NameforManga': req.body.title });
        res.status(200).json(tags_re.length);
    } catch (err) { console.log(err) }
});

router.post('/edit/', async(req, res) => {
    try {
        const filter = {
            _id: req.body.id
        };
        const tags_re = await CommentsH.findOneAndUpdate(filter, { $set: { commentdata: req.body.EditActive } });
        res.status(200).json(tags_re);
    } catch (err) { console.log(err) }
});
// Delete a quote
router.delete('/del/', async(req, res) => {
    const result = await CommentsH.deleteOne({
        _id: req.body.id
    });
    if (result) {
        res.status(200).json('prefecto delteted');
    }
});

router.post('/AddLike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        var tags_re = await CommentsH.find(filter);
        if (tags_re) {
            tags_re[0].Likecounter++
                var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Likecounter: tags_re[0].Likecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }
    } catch (err) { console.log(err) }

});

router.post('/ReduceLike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        var tags_re = await CommentsH.find(filter);
        if (tags_re && tags_re[0].Likecounter > 0) {
            tags_re[0].Likecounter--;
            var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Likecounter: tags_re[0].Likecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }

    } catch (err) { console.log(err) }

});

router.post('/AddDislike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        const tags_re = await CommentsH.find(filter);
        if (tags_re) {
            tags_re[0].Dislikecounter++;
            var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Dislikecounter: tags_re[0].Dislikecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }
    } catch (err) { console.log(err) }

});

router.post('/ReduceDislike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        const tags_re = await CommentsH.find(filter);
        if (tags_re && tags_re[0].Dislikecounter > 0) {
            tags_re[0].Dislikecounter--;
            var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Dislikecounter: tags_re[0].Dislikecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }
    } catch (err) { console.log(err) }

});

router.post('/ReLikeAddDislike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        const tags_re = await CommentsH.find(filter);
        if (tags_re && tags_re[0].Likecounter > 0) {
            tags_re[0].Likecounter--;
            var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Dislikecounter: tags_re[0].Dislikecounter, Likecounter: tags_re[0].Likecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }
    } catch (err) { console.log(err) }

});
router.post('/ReDislikeAddLike', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        const tags_re = await CommentsH.find(filter);
        if (tags_re && tags_re[0].Dislikecounter > 0) {
            tags_re[0].Dislikecounter--;
            var test2 = await CommentsH.findOneAndUpdate(filter, { $set: { Dislikecounter: tags_re[0].Dislikecounter, Likecounter: tags_re[0].Likecounter } }, { new: true })
            if (test2) {
                res.status(200).json(test2);
            }
        }
    } catch (err) { console.log(err) }

});

module.exports = router;