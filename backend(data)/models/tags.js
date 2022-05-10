const mongoose = require('mongoose');

const TagsSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String, default: '' },
});

module.exports = mongoose.model('genresFile', TagsSchema);