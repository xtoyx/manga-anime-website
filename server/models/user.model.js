const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
        type: String,
        trim: true,
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/DotOnline_gTLD_logo.svg/1200px-DotOnline_gTLD_logo.svg.png'
    },
    source: { type: String, default: "website" },
    age: { type: String, default: '0' },
    gender: { type: String, default: '' },
    MorA: { type: String, default: '' },
    Birth_of_Date: { type: String, default: '' },
    FirstName: { type: String, default: '' },
    SecondName: { type: String, default: '' },
    Country: { type: String, default: '' },
    MangaLiked: { type: Array, default: [] },
    Like: { type: Array, default: [] },
    Dislike: { type: Array, default: [] },
    Following: { type: Array, default: [] },
    UnFollowing: { type: Array, default: [] },
    verifed: { type: String, default: 'false' },
    ResetPassword: { type: String, default: 'false' },
    verify: {
        type: String,
        default: ''
    },
    VFirstTime: {
        type: String,
        default: ''
    },
    FirstTimeUsed: { type: String, default: 'false' },

}, { timestamps: true })

const model = mongoose.model('UserData', User)

module.exports = model