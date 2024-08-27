// MODELO AXEL JAVIER GUADALUPE ALVAREZ FELIPE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({

    nombre: String,
    apellido: String,
    email: String,
    password: String,
    rol: String,
    telefono: String,
    direccion: String,


    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number,
        subTotal: Number
    }],
    
    totalCarrito: Number
    
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);