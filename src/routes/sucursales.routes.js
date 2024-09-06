const express = require('express');

const SucursalesController = require('../controllers/sucursales.controller');
const autenticacionToken = require ('../middlewares/autenticacion');
const api = express.Router();

/* */
api.post('/agregarSucursal/:ID', autenticacionToken.Auth, SucursalesController.AgregarSucursal);
api.get('/verSucursalPorGestor/:ID', autenticacionToken.Auth, SucursalesController.obtenerSucursalesporIdGestor);


module.exports= api;