const express = require('express');
const router = express.Router();
const MangaH = require('../models/Manga');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../utils/cloudinary');
//trying read files after the script write to file
const axios = require('axios')
const saveAs = require('file-saver');
const JSZip = require('jszip')
var fs = require('fs');
const fetch = require('node-fetch');
let time = 40000;
var stopnow = false;
var arr_names = [];
const zip = new JSZip()
var Public_ListForDIDRemoving = [];
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

setInterval(async function discover() {
    if (fs.existsSync('./manga-reader') && !stopnow) {
        var files = fs.readdirSync('./manga-reader');
        arr_names = []
        for (let i = 0; i < files.length; i++) {
            try {
                fs.readFile(`./manga-reader/${files[i]}`, 'utf8', (err, jsonString) => {
                    if (err) {
                        console.log("Error reading file from disk:", err)
                        return
                    }
                    let data2 = JSON.parse(jsonString)
                    let array1 = {
                        name: files[i].trim().replace('.json', ''),
                        data: data2,
                    }
                    arr_names.push(array1)
                })
            } catch (err) {
                console.log('Error parsing JSON string:', err)
            }
        }
        stopnow = true;
        console.log('Done reading from files')
    }
}, 10000);

setInterval(async function(){
    try {
            arr_names.forEach(async function(obj1, index) {
                var shit1 = []
                var shit2 = []
                obj1.data.forEach(async function(obj2, index2) {
                    shit = {};
                    if (index2 === 0) {
                        Geners2 = []
                        obj2[0].Geners.forEach(function(gener) {
                            if (gener !== null) {
                                Geners2.push(gener)
                            }
                        })
                        shit2[0] = obj2[0].NameofManga
                        shit2[1] = Geners2
                        shit2[2] = obj2[0].linktoManga
                        shit2[3] = obj2[0].Picturelink
                        shit2[4]=obj2[0].ReadingDirection
                        shit2[5]=obj2[0].Author
                        shit2[6]=obj2[0].Status
                        shit2[7]=obj2[0].YearofRelease
                        shit2[8]=obj2[0].Description
                        shit2[9]=obj2[0].AlternativeNames
                    }
                    shit = {
                        chaptersName: obj2[0].chaptersName,
                        chapterslink: obj2[0].chapterslink,
                        pagesLink: obj2[0].pagesLink,
                        counter: index2
                    }
                    shit1.push(shit)
                })
                var okk = {
                    Name: shit2[0],
                    data: shit1,
                    PictureLink: shit2[3],
                    Genre: shit2[1],
                    linktoManga: shit2[2],
                    ReadingDirection: shit2[4],
                    Author: shit2[5],
                    Status: shit2[6],
                    YearOfRealease: shit2[7],
                    Description:shit2[8],
                    AlternativeNames: shit2[9]
                }
                if (!(await MangaH.exists(({ Name: okk.Name })))) {
                    const newcrypto1 = new MangaH(okk)
                    const savedCrypto1 = await newcrypto1.save();
                }
            })
        stopnow = false;
        console.log('Well it have uploaded itself')
    } catch (err) {
        console.log(err);
    }
},1000 * 60 * 10)


//for deleting files that did get downloaded
setInterval(async function herlpmeee() {
    Public_ListForDIDRemoving.map((value, index) => {
        if (fs.existsSync('./PublicFoldersForDownload' +
                value.NameOfFile) &&
            (value.NameOfFile !== '' || value.NameOfFile !== '??/') &&
            value.StartRemoving) {
            fs.rmdir('./PublicFoldersForDownload' + value.NameOfFile, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`${value.NameOfFile} is deleted!`);
                Public_ListForDIDRemoving.splice(index, 1);
            });
        }
    })
}, 2 * 60 * 1000)


//for deleting files after half hour
setInterval(async function herlpmeee3() {
    if (fs.existsSync('./PublicFoldersForDownload')) {
        fs.rmdir('./PublicFoldersForDownload', { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            console.log(`Public Download folder is deleted!`);
        });
    }
}, 30 * 60 * 1000)

// Get everything as manga
router.get('/', async(req, res) => {
    stopnow = true
    const manga_re = await MangaH.find();
    res.status(200).json(manga_re);
});

// UPADTE EVERYTHING
router.post('/new', async(req, res) => {
    try {
        setTimeout(async function() {
            arr_names.forEach(async function(obj1, index) {
                var shit1 = []
                var shit2 = []
                obj1.data.forEach(async function(obj2, index2) {
                    shit = {};
                    if (index2 === 0) {
                        Geners2 = []
                        obj2[0].Geners.forEach(function(gener) {
                            if (gener !== null) {
                                Geners2.push(gener)
                            }
                        })
                        shit2[0] = obj2[0].NameofManga
                        shit2[1] = Geners2
                        shit2[2] = obj2[0].linktoManga
                        shit2[3] = obj2[0].Picturelink
                        shit2[4]=obj2[0].ReadingDirection
                        shit2[5]=obj2[0].Author
                        shit2[6]=obj2[0].Status
                        shit2[7]=obj2[0].YearofRelease
                        shit2[8]=obj2[0].Description
                        shit2[9]=obj2[0].AlternativeNames
                    }
                    shit = {
                        chaptersName: obj2[0].chaptersName,
                        chapterslink: obj2[0].chapterslink,
                        pagesLink: obj2[0].pagesLink,
                        counter: index2
                    }
                    shit1.push(shit)
                })
                var okk = {
                    Name: shit2[0],
                    data: shit1,
                    PictureLink: shit2[3],
                    Genre: shit2[1],
                    linktoManga: shit2[2],
                    ReadingDirection: shit2[4],
                    Author: shit2[5],
                    Status: shit2[6],
                    YearOfRealease: shit2[7],
                    Description:shit2[8],
                    AlternativeNames: shit2[9]
                }
                if (!(await MangaH.exists(({ Name: okk.Name })))) {
                    const newcrypto1 = new MangaH(okk)
                    const savedCrypto1 = await newcrypto1.save();
                }
            })
        }, 12000)
        stopnow = false;
        res.status(200).json('Well it have uploaded itself')
    } catch (err) {
        console.log(err);
    }
});

// find a manga
router.get('/find/', async(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    stopnow = true
    const q = await MangaH.find({ Name: { $regex: `^${req.body.name}`, $options: 'si' } });
    res.json(q);
});

router.post('/findbyname/', async(req, res) => {
    stopnow = true
    const q = await MangaH.find({ Name: req.body.name });
    res.status(200).json(q);
});
router.post('/findbyid/', async(req, res) => {
    const q = await MangaH.find({ _id: req.body.id });
    res.status(200).json(q);
});



// Delete a quote
router.delete('/del/manga', async(req, res) => {
    stopnow = true
    const result = await MangaH.findOneAndDelete({ Name: req.body.name });
    res.json(result);
});

router.delete('/dall/', async(req, res) => {
    stopnow = true
    await MangaH.deleteMany({})
        .then(updatedDocument => {
            if (updatedDocument) {

            } else {
                console.log(`nothing`)
            }
        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))
    res.status(200).json(`deleted everything`);

});



// Get random quote
router.get('/random', async(req, res) => {
    const count = await MangaH.countDocuments();
    const random = Math.floor(Math.random() * count);
    const q = await MangaH.findOne().skip(random);

    res.json(q);
});

router.post('/Viewup', async(req, res) => {
    stopnow = true;
    const filter = { Name: req.body.title }
    const q = await MangaH.find(filter);
    if (q) {
        q[0].views++;
        const MangaReady = await MangaH.findOneAndUpdate(filter, { $set: { views: q[0].views } })
        if (MangaReady) {
            res.status(200).json(MangaReady);
        }
    }
})
router.post('/StartDownloadChapters', async(req, res) => {
    try {
        const NameofManga4 = req.body.NameofManga;
        const WhatChapter = req.body.WhatChapter;
        const genreateVerifyNUmbers = () => {
            var arr = [];
            while (arr.length < 5) {
                var r = Math.floor(Math.random() * 10) + 1;
                if (arr.indexOf(r) === -1) arr.push(r);
            }
            return arr;
        }
        var random = genreateVerifyNUmbers().join('');
        Public_ListForDIDRemoving.push({
            RandomSeed: random + 'h',
            NameOfFile: NameofManga4 + random,
            StartRemoving: false,
            IdForUser: 'idkyet'
        })
        const downloadFile = async(fileUrl, NameofMange, y, i) => {
            NameofMange = NameofMange.trim()
            const dir2 = `./PublicFoldersForDownload/${NameofMange}`
            const dir3 = `${dir2}/${y}`
            if (!fs.existsSync(dir3)) {
                fs.mkdirSync(dir3, { recursive: true });
            }
            try {
                //does exist
                if (!fs.existsSync(`./${dir3}/${i}.jpg`)) {
                    const response = await fetch(fileUrl);
                    const buffer = await response.buffer();
                    fs.writeFile(`./${dir3}/${i}.jpg`, buffer, () =>
                        console.log('download complete ', i));

                } else {
                    console.log('Aleardy did download Page', i);
                }
            } catch (error2) { console.log('error', error2) }

        };
        const hentaiii = await MangaH.findOne({ Name: NameofManga4 });
        if (WhatChapter.length < 10) {
            WhatChapter.map((value222, indxme) => {
                setTimeout(() => {
                    hentaiii.data.map(async(value234, index) => {
                        if (value234.chaptersName === value222) {
                            value234.pagesLink.map((valueforPagelink, index2) => {
                                downloadFile(valueforPagelink, NameofManga4 + random, value222, index2)
                            })
                        }
                    })
                }, 500)
            })
        } else {
            for (let imxw = 0; imxw <= 3; imxw++) {
                WhatChapter.map((value222, indxme) => {
                    setTimeout(() => {
                        hentaiii.data.map(async(value234, index) => {
                            if (value234.chaptersName === value222) {
                                value234.pagesLink.map((valueforPagelink, index2) => {
                                    downloadFile(valueforPagelink, NameofManga4 + random, value222, index2)
                                })
                            }
                        })
                    }, 500)
                })
            }
        }
        res.status(200).json(random + 'h')
    } catch (e) {
        console.log(e)
    }
})

router.get('/GetDownloadChapters/:id', async(req, res) => {
    Public_ListForDIDRemoving.map(async(value54, index54) => {
        if (value54.RandomSeed === req.params.id) {
            var dirPath = './PublicFoldersForDownload' + '/' + value54.NameOfFile;
            value54.StartRemoving = true;
            await res.zip({
                files: [{
                    path: dirPath,
                    name: 'pacakgeformanga-downloaded'
                }],
                filename: 'pacakgeformanga-downloaded.zip '
            });
        }
    })
})

//editing some mangas
router.post('/upload/photo', async(req, res) => {
    try {
        const cookie = req.cookies['AdminCookie']

        const claims = jwt.verify(cookie, 'secret321')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }

        const filter = { _id: req.body.id };
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        const user = await MangaH.findOneAndUpdate(filter, { $set: { PictureLink: uploadResponse.url } })
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.log(err);
    }
})

router.post('/edit', async(req, res) => {
    try {
        const cookie = req.cookies['AdminCookie']

        const claims = jwt.verify(cookie, 'secret321')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }

        const filter = { _id: req.body.id };
        const data = req.body.data;
        const user = await MangaH.findOneAndUpdate(filter, {
            $set: {
                Name: data.Name,
                data: data.data,
                PictureLink: data.PictureLink,
                Genre: data.Genre,
                linktoManga: data.linktoManga,
                views: data.views,
            }
        })
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.log(err);
    }
})

router.post('/RatingStars', async(req, res) => {
    const NameOfManga = req.body.title;
    const WhatManga = await MangaH.findOne({ Name: NameOfManga });
    if (WhatManga) {
        res.status(200).json(WhatManga.Rating);
    } else {
        res.status(404).send({
            error: 'Not Found'
        })
    }
})
router.post('/RatingStarsChange', async(req, res) => {
    const NameOfManga = req.body.title;
    const EditedRatingStars = req.body.EditedRatingStars;
    const filter = { Name: NameOfManga };
    const WhatManga = await MangaH.findOneAndUpdate(filter, {
        $set: {
            Rating: EditedRatingStars
        }
    })
    if (WhatManga) {
        res.status(200).send({ status: 'ok' });
    }
})
router.get('/Lastest',async(req, res) => {
    const manga_re = await MangaH.find().sort({_id:-1});
    res.status(200).json(manga_re);
})

module.exports = router;