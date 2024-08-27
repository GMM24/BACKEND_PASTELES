const express = require('express');

const usuarioController = require('../controllers/usuarios.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioController.Login);
//ROL USUARIO
api.post('/agregarUsuario',usuarioController.agregarUsuario);
api.put ('/editarUsuario/:ID', autenticacionToken.Auth, usuarioController.editarUsuario);

module.exports= api;