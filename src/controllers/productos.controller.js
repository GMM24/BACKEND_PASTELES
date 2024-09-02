const Categorias = require('../models/categorias.model');
const Productos = require('../models/productos.model');

function agregarProductoRolGestor(req, res) {
    if (req.user.rol !== 'ROL_GESTOR') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción " });
    }
    var parametros = req.body;

    if (parametros.nombreProducto && parametros.marca &&
        parametros.stock && parametros.precio && parametros.descripcion && parametros.nombreCategoria &&
        parametros.nombreProducto != "" && parametros.marca != "" &&
        parametros.stock != "" && parametros.precio != "" && parametros.descripcion != "" && parametros.nombreCategoria != "") {

        Categorias.findOne({ nombreCategoria: parametros.nombreCategoria }, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaEncontrada) return res.status(500).send({ mensaje: 'Esta Categoría no existe. Verifique el nombre' });

            var productosModel = new Productos();
            productosModel.nombreProducto = parametros.nombreProducto;
            productosModel.marca = parametros.marca;
            productosModel.stock = parametros.stock;
            productosModel.precio = parametros.precio;
            productosModel.descripcion = parametros.descripcion;
            productosModel.idCategoria = categoriaEncontrada._id;

            productosModel.save((err, productosGuardados) => {
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

function agregarProductoRolAdmin(req, res) {
    if (req.user.rol !== 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción " });
    }
    var parametros = req.body;
    if (parametros.nombreProducto && parametros.marca &&
        parametros.stock && parametros.precio && parametros.descripcion && parametros.nombreCategoria &&
        parametros.nombreProducto != "" && parametros.marca != "" &&
        parametros.stock != "" && parametros.precio != "" && parametros.descripcion != "" && parametros.nombreCategoria != "") {
        Categorias.findOne({ nombreCategoria: parametros.nombreCategoria }, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaEncontrada) return res.status(500).send({ mensaje: 'Esta Categoría no existe. Verifique el nombre' });
            var productosModel = new Productos();
            productosModel.nombreProducto = parametros.nombreProducto;
            productosModel.marca = parametros.marca;
            productosModel.stock = parametros.stock;
            productosModel.precio = parametros.precio;
            productosModel.descripcion = parametros.descripcion;
            productosModel.idCategoria = categoriaEncontrada._id;

            productosModel.save((err, productosGuardados) => {
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

module.exports = {
    agregarProductoRolGestor,
    agregarProductoRolAdmin
}