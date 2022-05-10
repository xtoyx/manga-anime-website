const express = require('express');
const router = express.Router();
const tagsH = require('../models/tags');


// Get everything as manga
router.get('/', async(req, res) => {
    const tags_re = await tagsH.find();
    res.status(200).json(tags_re);
});

router.post('/add', async(req, res) => {
    if (!await tagsH.exists({ name: req.body.name })) {
        const response = await tagsH.create({ name: req.body.name, description: req.body.description, });
        res.status(200).send({ status: 'Added' });
    } else {
        res.status(200).send({ status: 'exists' });
    }
});


router.post('/edit', async(req, res) => {
    const filter = { _id: req.body.id }
    if (await tagsH.exists(filter)) {
        const response = await tagsH.findOneAndUpdate(filter, {
            $set: {
                name: req.body.name,
                description: req.body.description,
            }
        });
        if (response) {
            res.status(200).send({ status: 'ok' });
        }
    }
});
// find a manga
router.get('/find/:name', async(req, res) => {
    const q = await tagsH.find({ Name: { $regex: `^${req.params.name}`, $options: 'si' } });
    res.status(200).json(q);
});




// Delete a quote
router.delete('/del/', async(req, res) => {
    const result = await tagsH.deleteOne({ name: req.body.name });
    res.json(result);
});




// Get random quote
router.get('/random', async(req, res) => {
    const count = await tagsH.countDocuments();
    const random = Math.floor(Math.random() * count);
    const q = await tagsH.findOne().skip(random);

    res.status(200).json(q);
});

module.exports = router;