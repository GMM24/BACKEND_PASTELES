const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Empresas = require('../models/empresa.model');

function agregarEmpresaRolGestor(req, res) {
    if (req.user.rol !== 'ROL_GESTOR') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción " });
    }
    var parametros = req.body;

    if (parametros.nombreEmpresa && parametros.direccion &&
        parametros.telefono && parametros.mision !="" && parametros.vision !="" && parametros.historia !="") {

        Empresas.findOne({ nombreEmpresa: parametros.nombreEmpresa }, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEncontrada) return res.status(500).send({ mensaje: 'Esta Categoría no existe. Verifique el nombre' });

            var empresasModel = new Empresas();
            empresasModel.nombreEmpresa = parametros.nombreEmpresa;
            empresasModel.direccion = parametros.direccion;
            empresasModel.telefono = parametros.telefono;
            empresasModel.mision = parametros.mision;
            empresasModel.vision = parametros.vision;
            empresasModel.historia = historia;
           

            empresasModel.save((err, productosGuardados) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!productosGuardados) return res.status(500).send({ mensaje: 'Error al agregar la empresa' });
                return res.status(200).send({ productos: productosGuardados });
            });
        });
    } else {
        return res.status(500)
            .send({ mensaje: 'Debe llenar los campos necesarios (nombreProducto, marca, descripción, stock, precio y nombreCategoria). Además, los campos no pueden ser vacíos' });
    }
}

module.exports ={
    agregarEmpresaRolGestor,
}