const mongoose = require('mongoose');
const Gasto = new mongoose.Schema({    
    fecha : { type: Date, default: Date.now , required: true },
    IdUser : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    IdTipoGesto : [{type: mongoose.Schema.Types.ObjectId, ref: 'TipoGasto'}],
    cantidad :  { type: Number , required: true },
    comentario: { type: String, required: false, trim: true },
    desde: { type: Date, default: Date.now , required: false },
    hasta: { type: Date, default: Date.now, required: false }
});
module.exports = mongoose.model('Gasto', Gasto);