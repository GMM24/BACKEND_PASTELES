const express = require('express');

const usuarioController = require('../controllers/usuarios.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioController.Login);
api.post('/agregarUsuario',usuarioController.agregarUsuario);

/* ---------- ADMINISTRACIÓN DEL ROL ADMIN --------- */
api.post ('/agregarRolCliente', autenticacionToken.Auth,  usuarioController.agregarClienteRolAdmin);
/* Editar usuario, el ID es el que se puso en el codigo */
api.put ('/editarRolCliente/:ID', autenticacionToken.Auth, usuarioController.editarUsuarioRolCliente);
/* Eliminar usuario por medio del id*/
api.delete("/eliminarRolCliente/:ID", autenticacionToken.Auth, usuarioController.eliminarUsuarioRolCliente);
/* Ver usuarios que tengan ROL_CLIENTE*/
api.get('/getUsuariosRolCliente', autenticacionToken.Auth, usuarioController.getUsuariosRolCliente);
/* Ver propio usuario por ID ROL_CLIENTE, ver perfil en conclusión */
api.get('/getUsuarioRolCliente/:ID', autenticacionToken.Auth, usuarioController.getUsuarioIdRolCliente);

/* ---------------- TAREAS DEL ROL_ADMIN  ---------*/
/* editar perfil put ID*/
api.put ('/editarRolAdmin/:ID' , autenticacionToken.Auth, usuarioController.editarUsuarioRolAdmin);

/* agregar, ROL_FACTURADOR por defecto post*/
api.post ('/agregarRolFacturador', autenticacionToken.Auth,  usuarioController.agregarFacturador);
/* agregar, ROL_EMPLEADO por defecto post*/
api.post ('/agregarRolEmpleado',  autenticacionToken.Auth, usuarioController.agregarEmpleado);
/* agregar, ROL_GESTOR por defecto post*/
api.post ('/agregarRolGestor',  autenticacionToken.Auth, usuarioController.agregarGestor);
/* ver usuarios con ROL_FACTURADOR get */
api.get ('/getUsuariosRolFacturador', autenticacionToken.Auth, usuarioController.getUsuariosRolFacturador);
/* ver usuarios con ROL_EMPLEADO  get*/
api.get ('/getUsuarioRolEmpleado', autenticacionToken.Auth, usuarioController.getUsuariosRolEmpleado);
/* ver usuarios con ROL_GESTOR get*/
api.get ('/getUsuarioRolGestor', autenticacionToken.Auth, usuarioController.getUsuariosRolGestor);
/* ver propio usuario por ID get ID*/
api.get ('/getUsuarioAdministrador/:ID', autenticacionToken.Auth, usuarioController.getUsuarioIdRolAdministrador);


/* ---------- TAREAS DEL ROL_FACTURADOR ------------- */
/* Editar usuario, el ID es el que se puso en el codigo */
api.put ('/editarRolFacturador/:ID', autenticacionToken.Auth, usuarioController.editarUsuarioRolFacturador);
/* Eliminar usuario por medio del id*/
api.delete("/eliminarRolFacturador/:ID", autenticacionToken.Auth, usuarioController.eliminarUsuarioRolFacturador);
/* Ver usuarios que tengan ROL_CLIENTE*/
api.get('/getUsuariosRolFacturador', autenticacionToken.Auth, usuarioController.getUsuariosRolFacturador);
/* Ver propio usuario por ID ROL_CLIENTE, ver perfil en conclusión */
api.get('/getUsuarioRolFacturador/:ID', autenticacionToken.Auth, usuarioController.getUsuarioIdRolFacturador);

/* ---------------TAREAS DEL ROL_GESTOR ---------- */
/* editar perfil */
api.put ('/editarRolGestor/:ID', autenticacionToken.Auth,  usuarioController.editarUsuarioRolGestor);
/* eliminar perfil */
api.delete ('/eliminarRolGestor/:ID', autenticacionToken.Auth, usuarioController.eliminarUsuarioRolGestor);
/* ver a los usuarios que tengan ROL_GESTOR */
api.get('/getUsuariosRolGestor', autenticacionToken.Auth, usuarioController.getUsuariosRoLGestor);
/* ver propio usuario por ID */
api.get('/getUsuarioRolGestor/:ID', autenticacionToken.Auth, usuarioController.getUsuarioIdRolGestor);



/* ---------- ADMINISTRACIÓN DEL ROL REPARTIDOR --------- */
api.post ('/agregarRolRepartidor', autenticacionToken.Auth,  usuarioController.agregarRepartidor);
// cambio
api.delete ('/eliminarRolRepartidor/:ID', autenticacionToken.Auth, usuarioController.eliminarUsuarioRolRepartidor);
api.put ('/editarRolRepartidor/:ID', autenticacionToken.Auth, usuarioController.editarUsuarioRolRepartidor);
api.get('/getUsuarioRolRepartidor', autenticacionToken.Auth, usuarioController.getUsuariosRolRepartidor);
api.get('/getUsuarioIdRolRepartidor/:ID', autenticacionToken.Auth, usuarioController.getUsuarioIdRolRepartidor);

//ROL CAJERO
 api.post('/agregarRolCajero' , autenticacionToken.Auth, usuarioController.agregarUsuarioCajero);
 api.put('/editarRolCajero/:ID', autenticacionToken.Auth , usuarioController.editarUsuarioCajero);
 api.delete('/eliminarRolCajero/:ID', autenticacionToken.Auth, usuarioController.eliminarUsuarioCajero);
 api.get ('/getRolCajero', autenticacionToken.Auth , usuarioController.getUsuarioCajero);
 api.get('/getRolIdCajero/:ID' , autenticacionToken.Auth ,usuarioController.getUsuarioIdCajero);

/* VER USUARIOS POR DEPARTAMENTO */
/* ROL GESTOR  */
api.get('/getGestorGuatemala', autenticacionToken.Auth, usuarioController.getGestorGuatemala);
api.get('/getGestorAltaVerapaz', autenticacionToken.Auth, usuarioController.getGestorAltaVerapaz);
api.get('/getGestorBajaVerapaz', autenticacionToken.Auth, usuarioController.getGestorBajaVerapaz);
api.get('/getGestorChimaltenango', autenticacionToken.Auth, usuarioController.getGestorChimaltenango);
api.get('/getGestorChiquimula', autenticacionToken.Auth, usuarioController.getGestorChiquimula);
api.get('/getGestorElProgreso', autenticacionToken.Auth, usuarioController.getGestorElProgreso);
api.get('/getGestorEscuintla', autenticacionToken.Auth, usuarioController.getGestorEscuintla);
api.get('/getGestorHuehuetenango', autenticacionToken.Auth, usuarioController.getGestorHuehuetenango);
api.get('/getGestorIzabal', autenticacionToken.Auth, usuarioController.getGestorIzabal);
api.get('/getGestorJalapa', autenticacionToken.Auth, usuarioController.getGestorJalapa);
api.get('/getGestorJutiapa', autenticacionToken.Auth, usuarioController.getGestorJutiapa);
api.get('/getGestorPeten', autenticacionToken.Auth, usuarioController.getGestorPeten);
api.get('/getGestorQuetzaltenango', autenticacionToken.Auth, usuarioController.getGestorQuetzaltenango);
api.get('/getGestorQuiche', autenticacionToken.Auth, usuarioController.getGestorQuiche);
api.get('/getGestorRetalhuleu', autenticacionToken.Auth, usuarioController.getGestorRetalhuleu);
api.get('/getGestorSacatepequez', autenticacionToken.Auth, usuarioController.getGestorSacatepequez);
api.get('/getGestorSanMarcos', autenticacionToken.Auth, usuarioController.getGestorSanMarcos);
api.get('/getGestorSantaRosa', autenticacionToken.Auth, usuarioController.getGestorSantaRosa);
api.get('/getGestorSolola', autenticacionToken.Auth, usuarioController.getGestorSolola);
api.get('/getGestorSuchitepequez', autenticacionToken.Auth, usuarioController.getGestorSuchitepequez);
api.get('/getGestorTotonicapan', autenticacionToken.Auth, usuarioController.getGestorTotonicapan);
api.get('/getGestorZacapa', autenticacionToken.Auth, usuarioController.getGestorZacapa);

/*ROL REPARTIDOR */
api.get('/getRepartidorGuatemala', autenticacionToken.Auth, usuarioController.getRepartidorGuatemala);
api.get('/getRepartidorAltaVerapaz', autenticacionToken.Auth, usuarioController.getRepartidorAltaVerapaz);
api.get('/getRepartidorBajaVerapaz', autenticacionToken.Auth, usuarioController.getRepartidorBajaVerapaz);
api.get('/getRepartidorChimaltenango', autenticacionToken.Auth, usuarioController.getRepartidorChimaltenango);
api.get('/getRepartidorChiquimula', autenticacionToken.Auth, usuarioController.getRepartidorChiquimula);
api.get('/getRepartidorElProgreso', autenticacionToken.Auth, usuarioController.getRepartidorElProgreso);
api.get('/getRepartidorEscuintla', autenticacionToken.Auth, usuarioController.getRepartidorEscuintla);
api.get('/getRepartidorHuehuetenango', autenticacionToken.Auth, usuarioController.getRepartidorHuehuetenango);
api.get('/getRepartidorIzabal', autenticacionToken.Auth, usuarioController.getRepartidorIzabal);
api.get('/getRepartidorJalapa', autenticacionToken.Auth, usuarioController.getRepartidorJalapa);
api.get('/getRepartidorJutiapa', autenticacionToken.Auth, usuarioController.getRepartidorJutiapa);
api.get('/getRepartidorPeten', autenticacionToken.Auth, usuarioController.getRepartidorPeten);
api.get('/getRepartidorQuetzaltenango', autenticacionToken.Auth, usuarioController.getRepartidorQuetzaltenango);
api.get('/getRepartidorQuiche', autenticacionToken.Auth, usuarioController.getRepartidorQuiche);
api.get('/getRepartidorRetalhuleu', autenticacionToken.Auth, usuarioController.getRepartidorRetalhuleu);
api.get('/getRepartidorSacatepequez', autenticacionToken.Auth, usuarioController.getRepartidorSacatepequez);
api.get('/getRepartidorSanMarcos', autenticacionToken.Auth, usuarioController.getRepartidorSanMarcos);
api.get('/getRepartidorSantaRosa', autenticacionToken.Auth, usuarioController.getRepartidorSantaRosa);
api.get('/getRepartidorSolola', autenticacionToken.Auth, usuarioController.getRepartidorSolola);
api.get('/getRepartidorSuchitepequez', autenticacionToken.Auth, usuarioController.getRepartidorSuchitepequez);
api.get('/getRepartidorTotonicapan', autenticacionToken.Auth, usuarioController.getRepartidorTotonicapan);
api.get('/getRepartidorZacapa', autenticacionToken.Auth, usuarioController.getRepartidorZacapa);

/* al momento de subir esto a github, eliminar las librerias :) */
module.exports= api;