const Categorias = require('../models/categorias.model');
const Productos = require('../models/productos.model');
const Sucursales = require('../models/sucursales.model');

function agregarProductoRolGestor(req, res) {
    if (req.user.rol !== 'ROL_GESTOR') {
        return res.status(403).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción" });
    }

    var parametros = req.body;
    const idSucursal = req.params.idSucursal; // ID de la sucursal desde la ruta
    const idCategoria = req.params.idCategoria; // ID de la categoría desde la ruta

    // Validar que se reciban todos los parámetros necesarios
    if (parametros.nombreProducto && parametros.marca &&
        parametros.stock && parametros.precio && parametros.descripcion &&
        parametros.nombreProducto !== "" && parametros.marca !== "" &&
        parametros.stock !== "" && parametros.precio !== "" && parametros.descripcion !== "") {

        // Buscar la categoría por ID
        Categorias.findById(idCategoria, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
            if (!categoriaEncontrada) return res.status(404).send({ mensaje: 'Esta categoría no existe.' });

            // Buscar la sucursal por ID
            Sucursales.findById(idSucursal, (err, sucursalEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if (!sucursalEncontrada) return res.status(404).send({ mensaje: 'Esta sucursal no existe.' });

                // Crear el modelo de producto
                var productosModel = new Productos();
                productosModel.nombreProducto = parametros.nombreProducto;
                productosModel.marca = parametros.marca;
                productosModel.stock = parametros.stock;
                productosModel.precio = parametros.precio;
                productosModel.descripcion = parametros.descripcion;

                // Agregar la categoría al array
                productosModel.descripcionCategoria = [{
                    idCategoria: categoriaEncontrada._id, // ID de la categoría
                    nombreCategoria: categoriaEncontrada.nombreCategoria // Nombre de la categoría
                }];

                // Agregar la sucursal al array
                productosModel.datosSucursal = [{
                    idSucursal: sucursalEncontrada._id, // ID de la sucursal
                    nombreSucursal: sucursalEncontrada.nombreSucursal, // Nombre de la sucursal
                    direccionSucursal: sucursalEncontrada.direccionSucursal, // Dirección de la sucursal
                    telefonoSucursal: sucursalEncontrada.telefonoSucursal // Teléfono de la sucursal
                }];

                // Guardar el producto
                productosModel.save((err, productosGuardados) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al guardar el producto' });
                    if (!productosGuardados) return res.status(500).send({ mensaje: 'Error al agregar el producto' });
                    return res.status(200).send({ productos: productosGuardados });
                });
            });
        });
    } else {
        return res.status(400).send({ mensaje: 'Debe llenar los campos necesarios (nombreProducto, marca, descripción, stock, precio). Además, los campos no pueden ser vacíos' });
    }
}




/* */
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
    agregarProductoRolAdmin,
}