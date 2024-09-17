const express = require('express');

const ProductosController = require('../controllers/productos.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();
/*ROL_GESTOR */
api.post('/agregarProductosRolGestor/:idSucursal/:idCategoria', autenticacionToken.Auth, ProductosController.agregarProductoRolGestor);

api.get('/verProductosRolGestor/:idSucursal/:idCategoria', autenticacionToken.Auth, ProductosController.verProductosPorCategoria);

api.get('/verProductosPorCategorias/:ID', autenticacionToken.Auth, ProductosController.obtenerProductosPorIdCategoria);

api.get('/verTodosProductos', autenticacionToken.Auth, ProductosController.obtenerProductos);

/*ROL_ADMIN */
// api.post('/agregarProductosRolAdmin/:ID', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);


// api.post('/agregarProductosGestor/:ID', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);

module.exports= api;