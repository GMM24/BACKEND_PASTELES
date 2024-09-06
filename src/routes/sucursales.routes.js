const express = require('express');

const SucursalesController = require('../controllers/sucursales.controller');
const autenticacionToken = require ('../middlewares/autenticacion');


api.post("/agregarSucursal/:ID", autenticacionToken.Auth, SucursalesController.);


module.exports= api;