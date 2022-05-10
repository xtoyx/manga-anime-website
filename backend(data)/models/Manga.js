const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    ReadingDirection: { type: String, default: ''},
    Author: { type: String, default: '' },
    Status: { type: String, default: '' },
    YearOfRealease: { type: String, default: '' },
    Description:{ type: String, default: '' },
    AlternativeNames: { type: Array, default: [] },
    data: Array,
    PictureLink: String,
    Genre: Array,
    linktoManga: String,
    Rating: Array,
    views: { type: Number, default: 0 },
});

module.exports = mongoose.model('MangasFile', MangaSchema);