const mongoose = require('mongoose');
const Film = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    year: { type: Number, required: false },
    genre: { type: String, required: true, trim: true },
});
module.exports = mongoose.model('Film', Film);