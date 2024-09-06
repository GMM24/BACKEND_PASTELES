const express = require('express');

const ProductosController = require('../controllers/productos.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();
/*ROL_GESTOR */
api.post('/agregarProductos/:ID', autenticacionToken.Auth, ProductosController.agregarProductoRolGestor);

/*ROL_GESTOR ver los productos por categoria y sucursal */
api.get('/verProductosPorCategoria/:idSucursal/:idCategoria', autenticacionToken.Auth, ProductosController.verProductosPorCategoria);

/*ROL_ADMIN */
api.post('/agregarProductosRolAdmin', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);



module.exports= api;