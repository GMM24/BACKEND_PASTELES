const express = require('express');

const PedidosController = require('../controllers/pedidos.controller');
const autenticacionToken = require ('../middlewares/autenticacion');
const api = express.Router();


api.post('/generarPedido/:idCarrito', autenticacionToken.Auth, PedidosController.generarPedido);


module.exports= api;