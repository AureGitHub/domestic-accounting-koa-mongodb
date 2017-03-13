const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    email: { type: String, required: false, trim: true },
    password: { type: String, required: false, trim: true },
    salt: { type: String, required: false, trim: true },
    provider: { type: String, required: true, trim: true, default: 'local' }
});
module.exports = mongoose.model('User', User);