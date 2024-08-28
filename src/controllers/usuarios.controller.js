// CONTROLLER USUARIOS AXEL ALVAREZ
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// USUARIO POR DEFECTO Y VERIFICACION
// USUARIO POR DEFECTO Y VERIFICACION
function Login(req, res) {

    var parametros = req.body;

    Usuarios.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{
                    if ( verificacionPassword ) {

                        if(parametros.obtenerToken === 'true'){

                            return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })

                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200).send({ usuario: usuarioEncontrado })
                        }     
                    } else {
                        return res.status(500).send({ mensaje: 'La contraseña es incorrecta'});
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'El correo no esta asignado'})
        }
    })
}


function agregarUsuario(req,res){

  var parametros = req.body;
  var usuarioModel = new Usuarios();
if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
  usuarioModel.nombre = parametros.nombre;
  usuarioModel.apellido = parametros.apellido;
  usuarioModel.email = parametros.email;
  usuarioModel.password = parametros.password;
  usuarioModel.rol = 'ROL_CLIENTE'; 
  usuarioModel.telefono = parametros.telefono;
  usuarioModel.direccion = parametros.direccion;
  usuarioModel.departamento = parametros.departamento;
  usuarioModel.municipio = parametros.municipio;
  usuarioModel.totalCarrito = 0;


  //Verificacion de email
  Usuarios.find({email:parametros.email}, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametros.password,null,null, (err, passwordEncriptada) =>{
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, usuarioGuardado)=> {
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if (!usuarioGuardado)return res.status(500).send({mensaje : "Error al agregar el cliente"});

            return res.status(200).send({usuario:usuarioGuardado});
          });
        });
      } else {
        return res.status(500).send({mensaje:"Correo Existente, ingrese uno nuevo"});
      }

  })
}else{
  return res.status(500).send({mensaje:"Complete los campos obligatorios"});
}
}

/* TAREAS DEL ROL_CLIENTE */

// 1. editar usuario
function editarUsuarioRolCliente(req, res){

  if(req.user.rol !== 'ROL_CLIENTE'){
    return res.status(500).send({mensaje:"Unicamente el ROL_CLIENTE puede realizar esta acción"});

  }

  var parametros = req.body;
  /* este es el id que se pone en la ruta */
  var idCliente = req.params.ID;
  Usuarios.findByIdAndUpdate(idCliente, parametros, {new:true},(err, usuarioEncontrado)=>{
    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
    if (!usuarioEncontrado)return res.status(500).send({mensaje : "Error al editar  el cliente"});
    return res.status(200).send({usuario:usuarioEncontrado});

  })
}

// 2. eliminar usuario
function eliminarUsuarioRolCliente(req, res){

  // siempre poner esto al principio, es para verificar quien puede realizar la acción
  if(req.user.rol !== 'ROL_CLIENTE'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_CLIENTE puede realizar esta acción "});
  }

  var idCliente = req.params.ID;
  Usuarios.findByIdAndDelete(idCliente, (err, eliminarRolUsuario)=>{

    if (err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!eliminarRolUsuario) return res.status(500).send({ mensaje: "Error al eliminar el usuario"});
    return  res.status(200).send({ usuario: eliminarRolUsuario});

  });

}

// 3. ver a usuarios con ROL_CLIENTE, en este caso es un ejemplo que debera de aplicarse a ROL_ADMIN
function getUsuariosRolCliente(req, res){

  // VERIFICADOR
  if(req.user.rol!== 'ROL_CLIENTE'){
    return res.status(500).send({mensaje: "Unicamente el ROL_CLIENTE puede realizar esta acción"});

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_CLIENTE'}, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados});
  })
}

/* 4. ver a un perfil que tenga ROL_CLIENTE por el ID*/
function getUsuarioIdRolCliente(req, res){
  if(req.user.rol!== 'ROL_CLIENTE'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_CLIENTE puede realizar esta acción"});
  }

  // buscar por id
  var idCliente = req.params.ID;

  Usuarios.findById(idCliente, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados})
  })
}

/* Siempre mandar a llamar a las funciones aqui */
module.exports = {
    Login,
    agregarUsuario,
    editarUsuarioRolCliente,
    eliminarUsuarioRolCliente,
    getUsuariosRolCliente,
    getUsuarioIdRolCliente
}



