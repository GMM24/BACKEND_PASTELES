
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var SucursalesSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    telefonoSucursal:Number,
    
    idEmpresa: {type:Schema.Types.ObjectId,ref:'Empresas'},


    gestorSucursales: [{
            
        idUsuario: {type:Schema.Types.ObjectId,ref:'Usuarios'},
        nombre: String,
        apellido: String,
        email: String,
        rol: String
    
}],
});


module.exports = mongoose.model('Sucursales',SucursalesSchema);