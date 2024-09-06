const Sucursales = require('../models/sucursales.model'); // Asegúrate de que la ruta sea correcta
const Empresas = require('../models/empresas.model'); // Asegúrate de importar el modelo de Empresas
const Usuarios = require('../models/usuarios.model'); // Asegúrate de importar el modelo de Usuario
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function AgregarSucursal(req, res){

    if (req.user.rol !== 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción " });
    }

    // Obtención de parámetros
    const parametros = req.body;
    const idEmpresa = req.params.ID; // ID de la empresa desde la ruta

    // Validar que se reciban los parámetros necesarios
    if (!parametros.nombreSucursal || !parametros.direccionSucursal || !parametros.telefonoSucursal || !parametros.email) {
        return res.status(400).send({ mensaje: 'Faltan parámetros necesarios (nombreSucursal, direccionSucursal, telefonoSucursal, email).' });
    }

    // Buscar la empresa por ID
    Empresas.findById(idEmpresa, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar la empresa.' });
        if (!empresaEncontrada) return res.status(404).send({ mensaje: 'Empresa no encontrada.' });

        // Buscar el usuario por email
        Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error al buscar el usuario.' });
            if (!usuarioEncontrado) return res.status(404).send({ mensaje: 'Usuario no encontrado por el email proporcionado.' });

            // Crear nuevo objeto de sucursal
            const nuevaSucursal = new Sucursales({
                nombreSucursal: parametros.nombreSucursal,
                direccionSucursal: parametros.direccionSucursal,
                telefonoSucursal: parametros.telefonoSucursal,
                idEmpresa: idEmpresa,
                gestorSucursales: [{
                    idUsuario: usuarioEncontrado._id, // ID del usuario encontrado
                    nombre: usuarioEncontrado.nombre,
                    apellido: usuarioEncontrado.apellido,
                    email: usuarioEncontrado.email,
                    rol: usuarioEncontrado.rol
                }]
            });

            // Guardar la nueva sucursal en la base de datos
            nuevaSucursal.save((err, sucursalGuardada) => {
                if (err) return res.status(500).send({ mensaje: 'Error al guardar la sucursal.' });
                return res.status(200).send({ mensaje: 'Sucursal agregada con éxito.', sucursal: sucursalGuardada });
            });
        });
    });

    

}
module.exports(
    AgregarSucursal
)