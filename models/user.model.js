const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    email: { type: String, required: false, unique: true,  trim: true },
    password: { type: String, required: false, trim: true },
    perfil :  { type: Number , required: true, default: 1 }
});
module.exports = mongoose.model('User', User);