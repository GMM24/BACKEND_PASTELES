const express = require('express');

const ProductosController = require('../controllers/productos.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();
/*ROL_GESTOR */
api.post('/agregarProductosRolGestor/:idSucursal/:idCategoria', autenticacionToken.Auth, ProductosController.agregarProductoRolGestor);
/*ROL_GESTOR ver los productos por categoria y sucursal */
//api.get('/verProductosPorCategoria/:idSucursal/:idCategoria', autenticacionToken.Auth, ProductosController.verProductosPorCategoria);

/*ROL_ADMIN */
// api.post('/agregarProductosRolAdmin/:ID', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);


// api.post('/agregarProductosGestor/:ID', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);

module.exports= api;