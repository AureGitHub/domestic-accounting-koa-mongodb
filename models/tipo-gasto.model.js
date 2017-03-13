const mongoose = require('mongoose');
const tipoGasto = new mongoose.Schema({    
    descripcion: { type: String, required: true, trim: true }    
});
module.exports = mongoose.model('TipoGasto', tipoGasto);