const mongoose = require('mongoose');

const AdminLikeMangas = new mongoose.Schema({
   Liked:{ type: Array , default: []}
}, { timestamps: true });

module.exports = mongoose.model('AdminLikeMangas', AdminLikeMangas);