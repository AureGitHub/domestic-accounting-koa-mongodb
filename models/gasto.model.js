const mongoose = require('mongoose');
const Gasto = new mongoose.Schema({    
    IdUser : [{type: mongoose.Schema.Types.ObjectId, ref: 'User1'}],
    IdTipoGesto : [{type: mongoose.Schema.Types.ObjectId, ref: 'TipoGasto'}],
    comentario: { type: String, required: true, trim: true },
    desde: { type: Date, default: Date.now , required: true },
    hasta: { type: Date, default: Date.now, required: false }
});
module.exports = mongoose.model('Gasto', Gasto);