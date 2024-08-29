const express = require('express');

const CategoriasController = require('../controllers/categorias.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();
api.post('/agregarCategoria', autenticacionToken.Auth, CategoriasController.AgregarCategoria);

api.get('/getCategorias', autenticacionToken.Auth, CategoriasController.ObtenerCategorias);

/* al momento de subir esto a github, eliminar las librerias :) */
module.exports= api;