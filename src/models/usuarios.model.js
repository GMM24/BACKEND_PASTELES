
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({

    nombre: String,
    apellido: String,
    email: String,
    password: String,
    rol: String,
    telefono: Number,
    direccion: String,
    departamento: String,
    municipio: String,

    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number,
        subTotal: Number
    }],
    
    totalCarrito: Number
    
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);