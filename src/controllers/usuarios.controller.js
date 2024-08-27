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
if(parametros.nombre && parametros.email
  && parametros.password
){
  usuarioModel.nombre = parametros.nombre;
  usuarioModel.apellido = parametros.apellido;
  usuarioModel.email = parametros.email;
  usuarioModel.password = parametros.password;
  usuarioModel.rol = 'ROL_CLIENTE'; 
  usuarioModel.telefono = parametros.telefono;
  usuarioModel.direccion = parametros.direccion;
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


function editarUsuario(req, res){

  if(req.user.rol !== 'ROL_CLIENTE'){
    return res.status(500).send({mensaje:"Unicamente ROL_CLIENTE tiene acceso"});

  }

  var parametros = req.body;
  var idCliente = req.params.ID;
  Usuarios.findByIdAndUpdate(idCliente, parametros, {new:true},(err, usuarioEncontrado)=>{
    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
    if (!usuarioEncontrado)return res.status(500).send({mensaje : "Error al editar  el cliente"});
    return res.status(200).send({usuario:usuarioEncontrado});

  })
}


module.exports = {
    Login,
    agregarUsuario,
    editarUsuario
}



