const express = require('express');

const SucursalesController = require('../controllers/sucursales.controller');
const autenticacionToken = require ('../middlewares/autenticacion');
const api = express.Router();

/* agregar sucursal por id de la empresa */
api.post('/agregarSucursal/:ID', autenticacionToken.Auth, SucursalesController.AgregarSucursal);
/* ver sucursales por el id del gestor */
api.get('/verSucursalPorGestor/:ID', autenticacionToken.Auth, SucursalesController.obtenerSucursalesporIdGestor);
/* ver sucursales por el id de la empresa*/
api.get('/verSucursalPorEmpresa/:ID', autenticacionToken.Auth, SucursalesController.obtenersucursalesPorIdEmpresa);

/* editar, eliminar, ver todas sucursales, ver sucursal por id*/


module.exports= api;