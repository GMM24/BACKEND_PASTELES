const express = require('express');

const SucursalesController = require('../controllers/sucursales.controller');
const autenticacionToken = require ('../middlewares/autenticacion');

const api = express.Router();


module.exports= api;