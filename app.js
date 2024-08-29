// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();


// RUTAS
const UsuariosRutas = require('./src/routes/usuario.routes');

const CategoriasRutas = require('./src/routes/categorias.routes');

// MIDDLEWARE INTERMEDIARIO
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERA
app.use(cors());

// CARGA DE RUTAS 
app.use('/api', UsuariosRutas, CategoriasRutas);

module.exports = app;
