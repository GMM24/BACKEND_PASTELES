const express = require('express');

const CategoriasController = require('../controllers/categorias.controller');
const autenticacionToken = require ('../middlewares/autenticacion');
const categoriasModel = require('../models/categorias.model');

const api = express.Router();
api.post('/agregarCategoria', autenticacionToken.Auth, CategoriasController.AgregarCategoria);
api.put ('/editarCategoria/:ID', autenticacionToken.Auth, CategoriasController.editarCategoria);
api.delete ('/eliminarCategoria/:ID', autenticacionToken.Auth, CategoriasController.eliminarCategoriaRolGestor);
api.get('/getCategorias', autenticacionToken.Auth, CategoriasController.ObtenerCategorias);
api.get ('/getCategoriaRolGestor', autenticacionToken.Auth, CategoriasController.getCategoriaRolGestor);



/* al momento de subir esto a github, eliminar las librerias :) */
module.exports= api;