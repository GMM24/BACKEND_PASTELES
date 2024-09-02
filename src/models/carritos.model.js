const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var CarritosSchema = Schema({
    idUsuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    compras: [{
            
                idProducto: {type:Schema.Types.ObjectId,ref:'Productos'},
                nombreProducto: String,
                cantidad: Number,
                precio: Number,
                subTotal: Number
            
        }],
    total: Number
});

module.exports = mongoose.model('Carritos',CarritosSchema);