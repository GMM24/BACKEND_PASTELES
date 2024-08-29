const express = require('express');

const CategoriasController = require('../controllers/categorias.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();


/* al momento de subir esto a github, eliminar las librerias :) */
module.exports= api;