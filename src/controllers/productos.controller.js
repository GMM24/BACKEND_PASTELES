const Categorias = require('../models/categorias.model');
const Productos = require('../models/productos.model');

function agregarProductoRolGestor(req, res) {
    if (req.user.rol !== 'ROL_GESTOR') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción " });
    }

    var parametros = req.body;
    const idSucursal = req.params.ID; // ID de la sucursal desde la ruta

    // Validar que se reciban todos los parámetros necesarios
    if (parametros.nombreProducto && parametros.marca &&
        parametros.stock && parametros.precio && parametros.descripcion && parametros.nombreCategoria &&
        parametros.nombreProducto !== "" && parametros.marca !== "" &&
        parametros.stock !== "" && parametros.precio !== "" && parametros.descripcion !== "" && parametros.nombreCategoria !== "") {

        // Buscar la categoría
        Categorias.findOne({ nombreCategoria: parametros.nombreCategoria }, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
            if (!categoriaEncontrada) return res.status(500).send({ mensaje: 'Esta categoría no existe. Verifique el nombre' });

            // Crear el modelo de producto
            var productosModel = new Productos();
            productosModel.nombreProducto = parametros.nombreProducto;
            productosModel.marca = parametros.marca;
            productosModel.stock = parametros.stock;
            productosModel.precio = parametros.precio;
            productosModel.descripcion = parametros.descripcion;
            productosModel.idCategoria = categoriaEncontrada._id;
            productosModel.idSucursal = idSucursal; // Agregar el ID de la sucursal

            // Guardar el producto
            productosModel.save((err, productosGuardados) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if (!productosGuardados) return res.status(500).send({ mensaje: 'Error al agregar el producto' });
                return res.status(200).send({ productos: productosGuardados });
            });
        });
    } else {
        return res.status(500).send({ mensaje: 'Debe llenar los campos necesarios (nombreProducto, marca, descripción, stock, precio y nombreCategoria). Además, los campos no pueden ser vacíos' });
    }
}


/* Solo me muestra los productos por categoria que pertenecen a esa sucursal, van dos id xd */
function verProductosPorCategoria(req, res) {

    if (req.user.rol !== 'ROL_GESTOR') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción " });
    }
    
    const idSucursal = req.params.idSucursal; // ID de la sucursal desde la ruta
    const idCategoria = req.params.idCategoria; // ID de la categoría desde la ruta

    // Validar que se reciban ambos IDs
    if (!idSucursal || !idCategoria) {
        return res.status(400).send({ mensaje: 'Faltan el ID de la sucursal o el ID de la categoría.' });
    }

    // Buscar los productos por ID de sucursal y ID de categoría
    Productos.find({ idSucursal, idCategoria }, (err, productosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los productos.' });
        if (!productosEncontrados || productosEncontrados.length === 0) {
            return res.status(404).send({ mensaje: 'No se encontraron productos para la sucursal y categoría proporcionadas.' });
        }

        return res.status(200).send({ productos: productosEncontrados });
    });
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
    verProductosPorCategoria
}