const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PedidosSchema = Schema({
  
    fecha: Date,
    tiempoEstimado: String,
    tipoPago: String ,
    estado:String,
    direccionEnvio: String,
    fechaEntrega: Date,
    horaEntrega: String,
    metodoEnvio: String,
    descuentos: Number,
    numeroDeOrden: Number,
    pagoConfirmado: String,
    
    idUsuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'},

    compras: [{
        idProducto: {type:Schema.Types.ObjectId,ref:'Productos'},
        nombreProducto: String,
        cantidad: Number,
        size:String,
        precio: Number,
        subTotal: Number,
        descripcionCategoria: [{
            idCategoria: { type: Schema.Types.ObjectId, ref: 'Categorias' },
            nombreCategoria: String,
        }],
        datosSucursal: [{
            idSucursal: { type: Schema.Types.ObjectId, ref: 'Sucursales' },
            nombreSucursal: String,
            direccionSucursal: String,
            telefonoSucursal: String
        }] 
    }],
    total: Number

});

module.exports = mongoose.model('Pedidos',PedidosSchema);