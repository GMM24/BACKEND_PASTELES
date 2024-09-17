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

/* NUEVA FUNCION PARA AGREGAR SUCURSAL AUTOMATIZA PROCESOS */
api.post('/agregarSucursalPor/:idEmpresa/:idUsuario', autenticacionToken.Auth, SucursalesController.AgregarSucursalPorIdEmpresaUsuario);

//SOLO ADMIN
/* editar, eliminar, ver todas sucursales, ver sucursal por id*/
api.put('/editarSucursalRolAdmin/:ID', autenticacionToken.Auth, SucursalesController.editarSucursalRolAdmin);
api.delete('/eliminarSucursalRolAdmin/:ID' , autenticacionToken.Auth, SucursalesController.eliminarSucursalRolAdmin);
api.get('/verSucursalRolAdmin',autenticacionToken.Auth , SucursalesController.verSucursalRolAdmin);
api.get('/verSucursalIDRolAdmin/:ID', autenticacionToken.Auth , SucursalesController.verSucursalIdRolAdmin);

// tareas del rol GESTOR

api.get('/verSucursalRolGestor',autenticacionToken.Auth , SucursalesController.verSucursalRolGestor);


module.exports= api;