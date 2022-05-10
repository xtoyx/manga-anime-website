const router = require("express").Router();
const passport = require("passport");
const bcrypt = require('bcryptjs')
const User = require('../models/user.model');
const { cloudinary } = require('../utils/cloudinary');


const CLIENT_URL = "http://localhost:3000/";

router.get("/login/success", async(req, res) => {
    if (req.user) {
        const userme = null;
        console.log('yep there a user?//')
        const emailcreate = req.user.name.givenName + req.user.name.familyName + "@hotmail.com";
        try {
            const check_please = await User.exists({ 'email': emailcreate })
            if (!check_please) {
                const genreateVerifyNUmbers = () => {
                    var arr = [];
                    while (arr.length < 5) {
                        var r = Math.floor(Math.random() * 10) + 1;
                        if (arr.indexOf(r) === -1) arr.push(r);
                    }
                    return arr;
                }
                var arr4 = genreateVerifyNUmbers()
                const newPassword = await bcrypt.hash("219120831", 6)
                userme = await User.create({
                    name: req.user.displayName,
                    email: emailcreate,
                    password: newPassword,
                    photo: req.user.photos[0].value,
                    source: "google",
                    VFirstTime: arr4.join(''),
                    FirstTimeUsed: 'false',
                })
                console.log("there no user")
            }
            //does exists
            User.findOne({ "email": emailcreate }).then(result => {
                res.status(200).json({
                    success: true,
                    message: "successfull",
                    user: result
                        // cookies: req.cookies
                });
            })
        } catch (err) {
            console.log(err)
        }
        console.log('done')

    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.post("/logout", (req, res) => {
    res
        .clearCookie("session")
        .clearCookie("session.sig")
        .redirect(CLIENT_URL + "/login")
});

router.post('/checkpass', async(req, res) => {
    try {
        const cookie = req.cookies['session'];
        const cookie2 = req.cookies['session.sig'];

        if (cookie && cookie2) {
            const user = await User.findOne({ _id: req.body.user2._id })
            console.log('is there a passowrd?' + req.body.ConfrimPasssword)

            if (!await bcrypt.compare(req.body.ConfrimPasssword, user.password)) {
                return res.status(400).send({
                    message: 'not correct password'
                })
            }
            res.status(200).json({ status: 'ok' });
        }
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticatedasdasd'
        })
    }
})


router.post('/update', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    var user;
    if (cookie && cookie2) {
        const filter = { _id: req.body._id };
        if (req.body.Passwordtosend != '' || req.body.Passwordtosend != null) {
            const newPassword = await bcrypt.hash(req.body.Passwordtosend, 6)
            user = await User.updateMany(filter, {
                $set: {
                    age: req.body.Age,
                    gender: req.body.Gender,
                    photo: req.body.photo,
                    Birth_of_Date: req.body.Birth_of_Date,
                    MorA: req.body.MorA,
                    FirstName: req.body.FirstName,
                    SecondName: req.body.SecondName,
                    name: req.body.Usernametosend,
                    email: req.body.Emailtosend,
                    password: newPassword,
                    Country: req.body.Country,
                }
            });
        } else {
            user = await User.updateMany(filter, {
                $set: {
                    age: req.body.Age,
                    gender: req.body.Gender,
                    photo: req.body.photo,
                    Birth_of_Date: req.body.Birth_of_Date,
                    MorA: req.body.MorA,
                    FirstName: req.body.FirstName,
                    SecondName: req.body.SecondName,
                    name: req.body.Usernametosend,
                    email: req.body.Emailtosend,
                    Country: req.body.Country,
                }
            });
        }
        console.log(user);

        res.status(200).json({ status: 'ok', body: user });
    }
})

router.post('/upload/photo', async(req, res) => {
    try {
        const cookie = req.cookies['session'];
        const cookie2 = req.cookies['session.sig'];
        if (cookie && cookie2) {
            const filter = { _id: req.body._id };
            const fileStr = req.body.data;
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'dev_setups',
            });
            const user = await User.findOneAndUpdate(filter, { $set: { photo: uploadResponse.url } })
            res.status(200).json({ status: 'ok' });
        }
    } catch (err) {
        console.log(err);
    }
})

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

router.post('/AddFollow', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const MangaLiked = req.body.title;
        const test1 = await User.findOne(filter);
        if (!test1.MangaLiked.includes(MangaLiked)) {
            test1.MangaLiked.push(MangaLiked)
            const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/RemoveFollow', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const MangaLiked = req.body.title;
        const test1 = await User.findOne(filter);
        if (test1.MangaLiked.includes(MangaLiked)) {
            var index = test1.MangaLiked.indexOf(MangaLiked);
            test1.MangaLiked.splice(index, 1)
            const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/AddLike', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Comment = req.body.commentid;
        const test1 = await User.findOne(filter);
        if (!test1.Like.includes(Comment)) {
            test1.Like.push(Comment)
            const user = await User.findOneAndUpdate(filter, { $set: { Like: test1.Like } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/AddDislike', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Comment = req.body.commentid;
        const test1 = await User.findOne(filter);
        if (!test1.Dislike.includes(Comment)) {
            test1.Dislike.push(Comment)
            const user = await User.findOneAndUpdate(filter, { $set: { Dislike: test1.Dislike } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/RemoveLike', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Comment = req.body.commentid;
        const test1 = await User.findOne(filter);
        if (test1.Like.includes(Comment)) {
            var index = test1.Like.indexOf(Comment);
            test1.Like.splice(index, 1)
            const user = await User.findOneAndUpdate(filter, { $set: { Like: test1.Like } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/RemoveDislike', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Comment = req.body.commentid;
        const test1 = await User.findOne(filter);
        if (test1.Dislike.includes(Comment)) {
            var index = test1.Dislike.indexOf(Comment);
            test1.Dislike.splice(index, 1)
            const user = await User.findOneAndUpdate(filter, { $set: { Dislike: test1.Dislike } })
            if (user) {
                res.status(200).json({ status: 'ok' });
            }
        } else {
            res.status(400).json({ status: 'Already there' })
        }
    }
})

router.post('/finduser', async(req, res) => {
    try {
        const name = req.body.name;
        const user = await User.findOne({ name: name }, { '_id': 0, 'email': 0, 'password': 0 });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ status: 'cant find anything' });
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/followthisuser', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Followthisone = req.body.name;
        var array = [];
        var finish;
        const test1 = await User.findOne(filter);
        if (!test1) {
            res.status(404).send({ status: 'no user ?? did u edit this shit?' })
        }
        if (!test1.Following.includes(Followthisone)) {
            array = test1.Following;
            array.push(Followthisone)
            finish = await User.findOneAndUpdate(filter, { $set: { Following: array } }, { new: true })
        }
        if (test1.UnFollowing.includes(Followthisone)) {
            var index = test1.UnFollowing.indexOf(Followthisone);
            test1.UnFollowing.splice(index, 1)
            const user = await User.findOneAndUpdate(filter, { $set: { UnFollowing: test1.UnFollowing } })
        }
        if (finish) {
            res.status(200).send({ status: 'ok' })
        } else {
            res.status(404).send({ status: 'not good' })
        }
    }
})
router.post('/Removefollowthisuser', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const Followthisone = req.body.name;
        const test1 = await User.findOne(filter);
        if (test1) {
            if (test1.Following.includes(Followthisone)) {
                var index = test1.Following.indexOf(Followthisone);
                test1.Following.splice(index, 1)
                const user = await User.findOneAndUpdate(filter, { $set: { Following: test1.Following } })
                if (user) {
                    res.status(200).json({ status: 'ok' });
                } else {
                    res.status(404).send({ status: 'not good' })
                }
            }
        } else {
            res.status(404).send({ status: 'no user ?? did u edit this shit?' })
        }
    }
})


router.post('/unfollowthisuser', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const UnFollowthisone = req.body.name;
        var array = [];
        var finish;
        const test1 = await User.findOne(filter);
        if (!test1) {
            res.status(404).send({ status: 'no user ?? did u edit this shit?' })
        }
        if (!test1.UnFollowing.includes(UnFollowthisone)) {
            array = test1.UnFollowing;
            array.push(UnFollowthisone)
            const finish = await User.findOneAndUpdate(filter, { $set: { UnFollowing: array } }, { new: true })
        }
        if (test1.Following.includes(UnFollowthisone)) {
            var index = test1.Following.indexOf(UnFollowthisone);
            test1.Following.splice(index, 1)
            const user = await User.findOneAndUpdate(filter, { $set: { Following: test1.Following } })
        }
        if (finish) {
            res.status(200).send({ status: 'ok' })
        } else {
            res.status(404).send({ status: 'not good' })
        }
    }
})
router.post('/Removeunfollowthisuser', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { _id: req.body.id };
        const UnFollowthisone = req.body.name;
        const test1 = await User.findOne(filter);
        if (test1) {
            if (test1.UnFollowing.includes(UnFollowthisone)) {
                var index = test1.UnFollowing.indexOf(UnFollowthisone);
                test1.UnFollowing.splice(index, 1)
                const user = await User.findOneAndUpdate(filter, { $set: { UnFollowing: test1.UnFollowing } })
                if (user) {
                    res.status(200).json({ status: 'ok' });
                } else {
                    res.status(404).send({ status: 'not good' })
                }
            }
        } else {
            res.status(404).send({ status: 'no user ?? did u edit this shit?' })
        }
    }
})
router.post('/CheckForCodeEmail', async(req, res) => {

    const filter = {
        email: req.body.EmailBefore
    }
    const test2 = await User.findOne(filter);
    if (test2.VFirstTime === req.body.Codetogo) {
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(404).json({ status: 'bad' });
    }
})


router.post('/ChangeEmail', async(req, res) => {
    const cookie = req.cookies['session'];
    const cookie2 = req.cookies['session.sig'];
    if (cookie && cookie2) {
        const filter = { email: req.body.EmailBefore };
        const test1 = await User.findOne(filter);
        if (test1) {
            const helpme = await User.updateOne(filter, {
                $set: {
                    email: req.body.EmailAfter,
                    FirstTimeUsed: 'true',
                    VFirstTime: '',
                }
            })
            if (helpme) {
                res.status(200).send({ status: 'ok' });
            }
        }
    }
})

module.exports = router