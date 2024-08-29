const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Categorias = require('../models/categorias.model');

/* agregar,  editar, eliminar  ROL_GESTOR, leer, leer por id, */

/*Agregar Categoria*/
if(req.user.rol !== 'ROL_GESTOR'){
    return res.status(500).send({mensaje:"Unicamente el ROL_GESTOR puede realizar esta acción"});

}
function agregarCategoria(req, res){
    var parametros = req.body;
    var categoriaModel = new Categorias();
if(parametros.nombre && parametros.descripcion){
    categoriaModel.nombre = parametros.nombre;
    categoriaModel.descripcion = parametros.descripcion;
    categoriaModel.rol = 'ROL_GESTOR';
}
}

/*Editar Categoria*/
function editarCategoria(req, res){
    if(req.user.rol !== 'ROL_GESTOR'){
        return res.status(500).send({mensaje:"Unicamente el ROL_GESTOR puede realizar esta acción"});
    
    }
    var parametros = req.body;
    var idGestor = req.params.ID;
    Categorias.findByIdAndUpdate(idGestor, parametros, {new:true}, (err, categoriaEncontrada)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if (!categoriaEncontrada)return res.status(500).send({mensaje : "Error al editar la Categoria"});
        return res.status(200).send({categoria:categoriaEncontrada}); 
    })
}

/* agregar,  editar eliminar  ROL_ADMIN, leer, leer por id, */


module.exports = {
agregarCategoria,
editarCategoria,
}