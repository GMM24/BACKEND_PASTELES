
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
    nombreProducto: String,
    marca:String,
    descripcion:String,
    stock: Number,
    precio: Number,
    vendido:Number,
    idCategoria: {type:Schema.Types.ObjectId,ref:'Categorias'},
    idSucursal:  {type:Schema.Types.ObjectId,ref:'sucursales'}
});

module.exports = mongoose.model('Productos',ProductosSchema);
