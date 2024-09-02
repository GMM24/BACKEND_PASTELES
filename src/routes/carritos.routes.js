const express = require('express');
const autenticacionToken = require ('../middlewares/autenticacion');
const CarritosController = require('../controllers/carritos.controller');
const api = express.Router();

//registro de carrito rol_cliente
api.post('/registrarCarrito',autenticacionToken.Auth, CarritosController.RegistrarCarrito);


module.exports= api;