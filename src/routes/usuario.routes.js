const express = require('express');

const usuarioController = require('../controllers/usuarios.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioController.Login);
api.post('/agregarUsuario',usuarioController.agregarUsuario);

/* ---------- TAREAS DEL ROL_CLIENTE --------- */
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

/* agregar, ROL_FACTURADOR por defecto post*/

/* agregar, ROL_EMPLEADO por defecto post*/

/* agregar, ROL_GESTOR por defecto post*/


/* ver usuarios con ROL_FACTURADOR get */

/* ver usuarios con ROL_EMPLEADO  get*/

/* ver usuarios con ROL_GESTOR get*/

/* ver propio usuario por ID get ID*/




/* ---------------TAREAS DEL ROL_FACTURADOR  ---------- */
/* editar perfil */
/* eliminar perfil */
/* ver a los usuarios que tengan ROL_FACTURADOR */
/* ver propio usuario por ID */


/* ---------------TAREAS DEL ROL_GESTOR ---------- */
/* editar perfil */
/* eliminar perfil */
/* ver a los usuarios que tengan ROL_GESTOR */
/* ver propio usuario por ID */

/* al momento de subir esto a github, eliminar las librerias :) */
module.exports= api;