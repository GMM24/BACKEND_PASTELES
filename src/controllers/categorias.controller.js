const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Categorias = require('../models/categorias.model');

/* agregar,  editar, eliminar  ROL_GESTOR, leer, leer por id, */

/*Agregar Categoria*/
function AgregarCategoria(req, res){

  if(req.user.rol !== 'ROL_GESTOR'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción "});
  }

    var parametros = req.body;
    var categoriaModel = new Categorias();

    if(parametros.nombre&&parametros.descripcion){
        categoriaModel.nombre = parametros.nombre;
        categoriaModel.descripcion = parametros.descripcion;
        categoriaModel.idAdministrador = req.user.sub;

        categoriaModel.save((err, categoriaAlmacenada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!categoriaAlmacenada) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});
            return res.status(200).send({ categorias: categoriaAlmacenada});
        })
    }
}


function ObtenerCategorias (req, res) {

  if(req.user.rol !== 'ROL_GESTOR'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción "});
  }

    Categorias.find((err, CategoriasGuardadas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ categorias: CategoriasGuardadas })
        /* Esto retornara
            {
                productos: ["array con todos los productos"]
            }
        */ 
    })
}

/*Editar Categoria*/
function editarCategoria(req, res){
    
  if(req.user.rol !== 'ROL_GESTOR'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción "});
  }

    
    var parametros = req.body;
    var idGestor = req.params.ID;
    Categorias.findByIdAndUpdate(idGestor, parametros, {new:true}, (err, categoriaEncontrada)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if (!categoriaEncontrada)return res.status(500).send({mensaje : "Error al editar la Categoria"});
        return res.status(200).send({categorias:categoriaEncontrada}); 
    })
}

function eliminarCategoriaRolGestor(req, res){
    if(req.user.rol !== 'ROL_GESTOR'){
      return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción "});
    }
  
    var idGestor = req.params.ID;
    Categorias.findByIdAndDelete(idGestor, (err, eliminarCategoria)=>{
  
      if (err) return res.status(500).send({ mensaje: "Error en la petición"});
      if(!eliminarCategoria) return res.status(500).send({ mensaje: "Error al eliminar la categoria"});
      return  res.status(200).send({ categorias: eliminarCategoria});
  
    })
  }


/*Ver categorias*/
function getCategoriaIdRolGestor(req, res){
  if(req.user.rol!== 'ROL_GESTOR'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción"});
  }

  // buscar por id
  var idGestor = req.params.ID;

  Categorias.findById(idGestor, (err, categoriasEncontradas)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!categoriasEncontradas) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ categorias: categoriasEncontradas})
  })
}


  /*Ver categoria por ID 
  function getCategoriaIDRolGestor(req, res){
   
    if(req.user.rol!== 'ROL_GESTOR'){
      return res.status(500).send({mensaje: "Unicamente el ROL_GESTOR puede realizar esta acción"});
  
    }
  
    // buscar por id
    var idGestor = req.params.ID;
  
    Usuarios.findById(idGestor, (err, categoriaEncontrada)=>{
      if(err) return res.status(500).send({ mensaje: "Error en la petición"});
      if(!categoriaEncontrada) return res.status(500).send({ mensaje: "Error al ver las categorias"});
      return res.status(200).send({ usuario: categoriaEncontrada})
    })
  }*/

  /*TAREA DE ROL ADMIN */

/* agregar,  editar eliminar  ROL_ADMIN, leer, leer por id, */
function AgregarCategoriaRolAdmin(req, res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción "});
  }

    var parametros = req.body;
    var categoriaModel = new Categorias();

    if(parametros.nombre&&parametros.descripcion){
        categoriaModel.nombre = parametros.nombre;
        categoriaModel.descripcion = parametros.descripcion;
        categoriaModel.idAdministrador = req.user.sub;

        categoriaModel.save((err, categoriaAlmacenada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!categoriaAlmacenada) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});
            return res.status(200).send({ categorias: categoriaAlmacenada});
        })
    }
}
function editarCategoriaRolAdmin(req, res){
    
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción "});
  }

    
    var parametros = req.body;
    var idCatAdmin = req.params.ID;
    Categorias.findByIdAndUpdate(idCatAdmin, parametros, {new:true}, (err, categoriaEncontrada)=>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
        if (!categoriaEncontrada)return res.status(500).send({mensaje : "Error al editar la Categoria"});
        return res.status(200).send({categorias:categoriaEncontrada}); 
    })
}
function eliminarCategoriaRolAdmin(req, res){
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción "});
  }

  var idCatAdmin = req.params.ID;
  Categorias.findByIdAndDelete(idCatAdmin, (err, eliminarCategoria)=>{

    if (err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!eliminarCategoria) return res.status(500).send({ mensaje: "Error al eliminar la categoria"});
    return  res.status(200).send({ categorias: eliminarCategoria});

  })
}

function getCategoriaRolAdmin(req, res){

  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  Categorias.find({ rol: 'ROL_ADMIN'}, (err, categoriaEncontrada)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!categoriaEncontrada) return res.status(500).send({ mensaje: "Error al ver las categorias"});
    return res.status(200).send({ categorias: categoriaEncontrada});
  })
}

function getCategoriaIDRolAdmin(req, res){
   
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  // buscar por id
  var idCatAdmin = req.params.ID;

  Categorias.findById(idCatAdmin, (err, categoriaEncontrada)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!categoriaEncontrada) return res.status(500).send({ mensaje: "Error al ver las categorias"});
    return res.status(200).send({ categorias: categoriaEncontrada})
  })
}

module.exports = {
AgregarCategoria,
editarCategoria,
ObtenerCategorias,
eliminarCategoriaRolGestor,
getCategoriaIdRolGestor,
/*getCategoriaIDRolGestor,*/
AgregarCategoriaRolAdmin,
editarCategoriaRolAdmin,
eliminarCategoriaRolAdmin,
getCategoriaRolAdmin,
getCategoriaIDRolAdmin
}