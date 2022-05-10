const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    username: { type: String },
    PictureLink: String,
    commentdata: String,
    NameforManga: String,
    Replyto: { type: String, default: null },
    HowMany: Number,
    Likecounter: { type: Number, default: 0 },
    Dislikecounter: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CommentsMangas', MangaSchema);