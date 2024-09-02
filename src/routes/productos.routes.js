const express = require('express');

const ProductosController = require('../controllers/productos.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();
/*ROL_GESTOR */
api.post('/agregarProductos', autenticacionToken.Auth, ProductosController.agregarProductoRolGestor);

/*ROL_ADMIN */
api.post('/agregarProductosRolAdmin', autenticacionToken.Auth, ProductosController.agregarProductoRolAdmin);
module.exports= api;