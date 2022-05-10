const User = require('../models/user.model');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { cloudinary } = require('../utils/cloudinary');
const nodemailer = require("nodemailer")
require("dotenv").config()
const cors = require('cors')

const authorization = (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, "secret");
        req.userId = data.id;
        req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
};

const authorizationAdmin = (req, res, next) => {
    const token = req.cookies['AdminCookie'];
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, "secret321");
        req.userId = data.id;
        req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
};
//routers you can find ,edit,delete,all else
router.post('/register', async(req, res) => {
    try {
        console.log(req.body)
        const newPassword = await bcrypt.hash(req.body.password, 6)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: err })
    }
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }


    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    const token = jwt.sign({ _id: user._id }, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    })
    return res.json({ status: 'ok', user: token })
})

router.get('/user', authorization, async(req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()
        res.status(200).send({ data })
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticatedasdasd'
        })
    }
})


router.post('/checkpass', authorization, async(req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }

        const user = await User.findOne({ _id: claims._id })
        console.log('is there a passowrd?' + req.body.ConfrimPasssword)

        if (!await bcrypt.compare(req.body.ConfrimPasssword, user.password)) {
            return res.status(400).send({
                message: 'not correct password'
            })
        }
        res.status(200).json({ status: 'ok' });
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticatedasdasd'
        })
    }
})


router.post('/update', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    var user;
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
})

router.post('/upload/photo', async(req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, 'secret')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }
        const filter = { _id: claims._id };
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        const user = await User.findOneAndUpdate(filter, { $set: { photo: uploadResponse.url } })
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.log(err);
    }
})

router.post('/logout', authorization, (req, res) => {
    return res
        .clearCookie("jwt")
        .status(200)
        .json({ message: 'ok' });

})

router.post('/AddFollow', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (!test1.MangaLiked.includes(MangaLiked2)) {
        test1.MangaLiked.push(MangaLiked2)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Already There' })
    }
})
router.post('/RemoveFollow', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (test1.MangaLiked.includes(MangaLiked2)) {
        var index = test1.MangaLiked.indexOf(MangaLiked2);
        test1.MangaLiked.splice(index, 1)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Dont Exist???' })
    }
})

router.post('/AddLike', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (!test1.MangaLiked.includes(MangaLiked2)) {
        test1.MangaLiked.push(MangaLiked2)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Already There' })
    }
})
router.post('/AddDislike', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (!test1.MangaLiked.includes(MangaLiked2)) {
        test1.MangaLiked.push(MangaLiked2)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Already There' })
    }
})
router.post('/RemoveLike', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (!test1.MangaLiked.includes(MangaLiked2)) {
        test1.MangaLiked.push(MangaLiked2)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Already There' })
    }
})
router.post('/RemoveDislike', authorization, async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: claims._id };
    const MangaLiked2 = req.body.title;
    const test1 = await User.findOne(filter);
    if (!test1.MangaLiked.includes(MangaLiked2)) {
        test1.MangaLiked.push(MangaLiked2)
        const user = await User.findOneAndUpdate(filter, { $set: { MangaLiked: test1.MangaLiked } })
        if (user) {
            res.status(200).json({ status: 'ok' });
        }
    } else {
        res.status(300).json({ status: 'Already There' })
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
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
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
})
router.post('/Removefollowthisuser', async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
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
})


router.post('/unfollowthisuser', async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
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
})
router.post('/Removeunfollowthisuser', async(req, res) => {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
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
})


router.post('/Adminlogin', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        name: req.body.username
    })
    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }
    if(req.body.email!=='max.pan13@hotmail.com'){
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }
    if (req.body.passworddata !== user.password) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }
    const token = jwt.sign({ _id: user._id }, "secret321")

    res.cookie('AdminCookie', token, {
        httpOnly: true,
        maxAge: 120 * 24 * 60 * 60 * 1000 // 120 day
    })
    return res.json({ status: 'ok', user: token })
})
router.get('/CheckForAdminCookie', authorizationAdmin, async(req, res) => {
    try {
        const cookie = req.cookies['AdminCookie']

        const claims = jwt.verify(cookie, 'secret321')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated credentials'
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()
        res.status(200).send({ data })
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticatedasdasd'
        })
    }
})

router.get('/logoutAdmin', authorizationAdmin, (req, res) => {
    return res
        .clearCookie("AdminCookie")
        .status(200)
        .json({ message: 'ok' });
})

router.get('/getallUsers', async(req, res) => {
    const cookie = req.cookies['AdminCookie']

    const claims = jwt.verify(cookie, 'secret321')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }

    const All_Users = await User.find();
    if (All_Users) {
        res.status(200).json(All_Users)
    }
})

router.post('/admin/update', authorization, async(req, res) => {
    const cookie = req.cookies['AdminCookie']

    const claims = jwt.verify(cookie, 'secret321')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const filter = { _id: req.body.id };
    var user;
    var source = req.body.source,
        name = req.body.name,
        email = req.body.email,
        password = req.body.newPassword;

    const newPassword = await bcrypt.hash(password, 6)
    if (newPassword) {
        user = await User.updateMany(filter, {
            $set: {
                source: source,
                name: name,
                email: email,
                password: newPassword,
            }
        });
    }
    res.status(200).json({ status: 'ok' });
})

router.post('/admin/upload/photo', async(req, res) => {
    const cookie = req.cookies['AdminCookie']

    const claims = jwt.verify(cookie, 'secret321')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }

    try {
        const filter = { _id: req.body.id };
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        const user = await User.findOneAndUpdate(filter, { $set: { photo: uploadResponse.url } })
        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.log(err);
    }
})

router.delete('/admin/deleteUser', async(req, res) => {
    const cookie = req.cookies['AdminCookie']

    const claims = jwt.verify(cookie, 'secret321')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
    const result = await User.findOneAndDelete({ name: req.body.name });
    res.status(200).json(result);
})

router.post('/checkemail', async(req, res) => {
    const IsThereEmail = await User.exists(({
        email: req.body.email
    }));
    console.log(IsThereEmail)
    if (IsThereEmail && IsThereEmail !== '') {
        res.status(200).send({ status: 'ok', email: IsThereEmail })
    } else {
        res.status(200).send({ status: 'bad', email: IsThereEmail })
    }
})

router.post("/send_mail", cors(), async(req, res) => {
    try {
        let { type } = req.body;
        let EmailTargeted = req.body.EmailTargeted;
        let test2 = await User.findOne(({ email: EmailTargeted }))
        var id;
        if (test2) {
            id = (test2._id)
        }

        const transport = nodemailer.createTransport({
            // host: process.env.MAIL_HOST,
            // port: process.env.MAIL_PORT,
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        var response;
        if (type === 'verify') {
            const genreateVerifyNUmbers = () => {
                var arr = [];
                while (arr.length < 5) {
                    var r = Math.floor(Math.random() * 10) + 1;
                    if (arr.indexOf(r) === -1) arr.push(r);
                }
                return arr;
            }
            var arr4 = genreateVerifyNUmbers()
            let test4 = await User.updateOne({
                email: EmailTargeted
            }, { $set: { verify: arr4.join('') } });


            response = await transport.sendMail({
                from: process.env.MAIL_FROM,
                to: EmailTargeted,
                subject: "verify your email address",
                html: `<div className="email" style="
                    border: 1px solid black;
                    padding: 20px;
                    font-family: sans-serif;
                    line-height: 2;
                    font-size: 20px; 
                    ">
                    <h2>here is your link for <a href='http://localhost:3000/VerifyEmail'>verfication!</a></h2>
                    <h4>Code Is ${arr4.join('')}</h4>
                    <p>Dont Share it Thanks</p>
                     </div>
                `
            })
        }
        if (type === 'Change Email') {
            const genreateVerifyNUmbers = () => {
                var arr = [];
                while (arr.length < 5) {
                    var r = Math.floor(Math.random() * 10) + 1;
                    if (arr.indexOf(r) === -1) arr.push(r);
                }
                return arr;
            }
            var arr4 = genreateVerifyNUmbers()
            let test4 = await User.updateOne({
                email: EmailTargeted
            }, { $set: { VFirstTime: arr4.join('') } });

            if (test4.verifed !== 'true') {
                res.status(200).send({ status: 'NotV' })
            }

            response = await transport.sendMail({
                from: process.env.MAIL_FROM,
                to: EmailTargeted,
                subject: "You Want Change your Email address",
                html: `<div className="email" style="
                    border: 1px solid black;
                    padding: 20px;
                    font-family: sans-serif;
                    line-height: 2;
                    font-size: 20px; 
                    ">
                    <h4>Code Is ${arr4.join('')}</h4>
                    <p>Dont Share it Thanks</p>
                     </div>
                `
            })
        }
        if (type === 'forget') {
            let test4 = await User.updateOne({
                email: EmailTargeted
            }, { $set: { ResetPassword: 'true' } });

            response = await transport.sendMail({
                from: process.env.MAIL_FROM,
                to: EmailTargeted,
                subject: "Did you Forget Your Passoword",
                html: `<div className="email" style="
                    border: 1px solid black;
                    padding: 20px;
                    font-family: sans-serif;
                    line-height: 2;
                    font-size: 20px; 
                    ">
                    <h2>here is your link for <a href='http://localhost:3000/ResetPassword/${id}'>reset Password!</a></h2>
                    <p>Dont Share it Thanks / If You Didnt Select It Dont Enter The Link</p>
                     </div>
                `
            })
        }
        if (response) {
            res.status(200).send({ status: 'ok' })
        }
    } catch (err) {
        console.log(err)
    }
})

router.post('/Did_You_Order_Pass', async(req, res) => {
    try {
        const filter = { _id: req.body.id }
        if (User.exists((filter))) {
            const User3 = await User.findOne(filter)
            if (User3.ResetPassword === 'true') {
                res.status(200).send({ status: 'ok' });
            }
        } else {
            res.status(404).send({ status: 'not good' });
        }
    } catch (err) {
        console.log(err)
    }
})

router.post("/Update_Password", async(req, res) => {
    try {
        const WhichId = req.body.id;
        const Pass = await bcrypt.hash(req.body.Pass, 6);
        const filter = { _id: WhichId }
        if (User.exists(({ _id: WhichId }))) {
            const user = await User.updateOne(filter, {
                $set: {
                    password: Pass,
                    ResetPassword: 'false',
                }
            })
            if (user) {
                res.status(200).send({ status: 'ok' });
            }
        } else {
            res.status(404).send({ status: 'not good' });
        }
    } catch (err) {
        console.log(err)
    }
})

router.post("/CheckVerifyAndEmail", async(req, res) => {
    try {
        const VerifyCode = req.body.Number;
        const filter = { email: req.body.Email }
        const filter2 = { email: req.body.Email, verify: VerifyCode }
        if (User.exists((filter))) {
            const user = await User.updateOne(filter2, {
                $set: {
                    verifed: 'true',
                    verify: ''
                }
            })
            if (user) {
                res.status(200).send({ status: 'ok' });
            }
        } else {
            res.status(404).send({ status: 'bad' });
        }
    } catch (err) {
        console.log(err)
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
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, 'secret')

    if (!claims) {
        return res.status(401).send({
            message: 'unauthenticated credentials'
        })
    }
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
            res.status(200).json({ status: 'ok' });
        }
    }

})


router.post('/loginAndRemberMe', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if (!user) {
        return { status: 'error', error: 'Invalid login' }
    }


    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        })
    }

    const token = jwt.sign({ _id: user._id }, "secret")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
    })
    return res.json({ status: 'ok', user: token })
})

module.exports = router;