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

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

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
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción "});
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
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});

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
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});
  }

  // buscar por id
  var idCliente = req.params.ID;

  Usuarios.findById(idCliente, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados})
  })
}


/* TAREAS DEL ROL_ADMIN */
/* 1. editar perfil */
  function editarUsuarioRolAdmin(req,res){
    if(req.user.rol !== 'ROL_ADMIN'){
      return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});
  
    }
  
    var parametros = req.body;
    var idAdmin = req.params.ID;
    Usuarios.findByIdAndUpdate(idAdmin, parametros, {new:true},(err, adminEncontrado)=>{
      if (err) return res.status(500).send({mensaje: "Error en la peticion"});
      if (!adminEncontrado)return res.status(500).send({mensaje : "Error al editar el Administrador"});
      return res.status(200).send({usuario:adminEncontrado});
  
    })
  }


  /* 2. agregar, ROL_FACTURADOR por defecto */
function agregarClienteRolAdmin(req,res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

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

/* 2. agregar, ROL_FACTURADOR por defecto */
function agregarFacturador(req,res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
  usuarioModel.nombre = parametros.nombre;
  usuarioModel.apellido = parametros.apellido;
  usuarioModel.email = parametros.email;
  usuarioModel.password = parametros.password;
  usuarioModel.rol = 'ROL_FACTURADOR'; 
  usuarioModel.telefono = parametros.telefono;
  usuarioModel.direccion = parametros.direccion;
  usuarioModel.departamento = parametros.departamento;
  usuarioModel.municipio = parametros.municipio;


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
/* 3. agregar, ROL_EMPLEADO por defecto */
function agregarEmpleado(req,res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
  usuarioModel.nombre = parametros.nombre;
  usuarioModel.apellido = parametros.apellido;
  usuarioModel.email = parametros.email;
  usuarioModel.password = parametros.password;
  usuarioModel.rol = 'ROL_EMPLEADO'; 
  usuarioModel.telefono = parametros.telefono;
  usuarioModel.direccion = parametros.direccion;
  usuarioModel.departamento = parametros.departamento;
  usuarioModel.municipio = parametros.municipio;

  Usuarios.find({email:parametros.email}, (err, empleadoGuardado) => {
    if (empleadoGuardado.length == 0) {
      bcrypt.hash(parametros.password,null,null, (err, passwordEncriptada) =>{
        usuarioModel.password = passwordEncriptada;



        usuarioModel.save((err, empleadoGuardado)=> {
          if (err) return res.status(500).send({mensaje: "Error en la peticion"});
          if (!empleadoGuardado)return res.status(500).send({mensaje : "Error al agregar el empleado"});

          return res.status(200).send({usuario:empleadoGuardado});
        });
      });
    } else {
      return res.status(500).send({mensaje:"Correo Existente, ingrese uno nuevo"});
    }

})
}else{
return res.status(500).send({mensaje:"Complete los campos obligatorios"});
}}
/* 4. agregar, ROL_GESTOR por defecto */
function agregarGestor(req,res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
if(parametros.nombre && parametros.apellido && parametros.email && parametros.password){
  usuarioModel.nombre = parametros.nombre;
  usuarioModel.apellido = parametros.apellido;
  usuarioModel.email = parametros.email;
  usuarioModel.password = parametros.password;
  usuarioModel.rol = 'ROL_GESTOR'; 
  usuarioModel.telefono = parametros.telefono;
  usuarioModel.direccion = parametros.direccion;
  usuarioModel.departamento = parametros.departamento;
  usuarioModel.municipio = parametros.municipio;

  Usuarios.find({email:parametros.email}, (err, gestorGuardado) => {
    if (gestorGuardado.length == 0) {
      bcrypt.hash(parametros.password,null,null, (err, passwordEncriptada) =>{
        usuarioModel.password = passwordEncriptada;



        usuarioModel.save((err, gestorGuardado)=> {
          if (err) return res.status(500).send({mensaje: "Error en la peticion"});
          if (!gestorGuardado)return res.status(500).send({mensaje : "Error al agregar el empleado"});

          return res.status(200).send({usuario:gestorGuardado});
        });
      });
    } else {
      return res.status(500).send({mensaje:"Correo Existente, ingrese uno nuevo"});
    }

})
}else{
return res.status(500).send({mensaje:"Complete los campos obligatorios"});
}}

/* 5. ver usuarios con ROL_FACTURADOR  funcion 3*/
function getUsuariosRolFacturador(req, res){

  if(req.user.rol !== 'ROL_ADMIN'){
      return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});
  
  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_FACTURADOR'}, (err, facturadorEncontrado)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!facturadorEncontrado) return res.status(500).send({ mensaje: "Error al ver los facturadores"});
    return res.status(200).send({ usuario: facturadorEncontrado});
  })
}

/* 6.  ver usuarios con unicamente ROL_EMPLEADO  */
function getUsuariosRolEmpleado(req, res){
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_EMPLEADO'}, (err, empleadoEncontrado)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!empleadoEncontrado) return res.status(500).send({ mensaje: "Error al ver los empleados"});
    return res.status(200).send({ usuario: empleadoEncontrado});
  })
}
/* 7. ver usuarios con ROL_GESTOR */
function getUsuariosRolGestor(req, res){

  // VERIFICADOR
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_GESTOR'}, (err, gestorEncontrado)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!gestorEncontrado) return res.status(500).send({ mensaje: "Error al ver los gestores de inventario"});
    return res.status(200).send({ usuario: gestorEncontrado});
  })
}

/* 8. ver propio usuario por ID*/
function getUsuarioIdRolAdministrador(req, res){
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});
  }

  // buscar por id
  var idAdministrador = req.params.ID;

  Usuarios.findById(idAdministrador, (err, administradorEncontrado)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!administradorEncontrado) return res.status(500).send({ mensaje: "Error al ver los administradores"});
    return res.status(200).send({ usuario: administradorEncontrado})
  })
}


/* TAREAS DEL ROL_FACTURADOR */
/* Editar usuario */
function editarUsuarioRolFacturador(req, res){
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});
  }
  var parametros = req.body;
  /* este es el id que se pone en la ruta */
  var idFacturador = req.params.ID;
  Usuarios.findByIdAndUpdate(idFacturador, parametros, {new:true},(err, usuarioEncontrado)=>{
    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
    if (!usuarioEncontrado)return res.status(500).send({mensaje : "Error al editar  el cliente"});
    return res.status(200).send({usuario:usuarioEncontrado});
  })
}

/* Eliminar usuario*/
function eliminarUsuarioRolFacturador(req, res){

  // siempre poner esto al principio, es para verificar quien puede realizar la acción
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});
  }

  var idFacturador = req.params.ID;
  Usuarios.findByIdAndDelete(idFacturador, (err, eliminarRolUsuario)=>{

    if (err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!eliminarRolUsuario) return res.status(500).send({ mensaje: "Error al eliminar el usuario"});
    return  res.status(200).send({ usuario: eliminarRolUsuario});
  });

}

/* Ver usuarios con el ROL_FACTURADOR */
function getUsuariosRolFacturador(req, res){

  // VERIFICADOR
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_FACTURADOR'}, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados});
  })
}

/* Ver usuario propio del ROL_FACTURADOR*/
function getUsuarioIdRolFacturador(req, res){
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});
  }
  // buscar por id
  var idFacturador = req.params.ID;

  Usuarios.findById(idFacturador, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados})
  })
}

// 1. editar usuario
// 2 eliminar usuario
// 3 ver usuarios
// 4 ver propio usuario

/*TAREAS DE ROL GESTOR*/
function editarUsuarioRolGestor(req,res){
  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({mensaje:"Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  var parametros = req.body;
  var idGestor = req.params.ID;
  Usuarios.findByIdAndUpdate(idGestor, parametros, {new:true},(err, gestoresEncontrados)=>{
    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
    if (!gestoresEncontrados)return res.status(500).send({mensaje : "Error al editar el gestor"});
    return res.status(200).send({usuario:gestoresEncontrados});

  })
}
/*eliminar perfil de gestor*/
function eliminarUsuarioRolGestor(req, res){

  if(req.user.rol !== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción "});
  }

  var idGestor = req.params.ID;
  Usuarios.findByIdAndDelete(idGestor, (err, eliminarRolGestor)=>{

    if (err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!editarUsuarioRolGestor) return res.status(500).send({ mensaje: "Error al eliminar el gestor"});
    return  res.status(200).send({ usuario: eliminarRolGestor});

  });

}
/* Ver usuarios con el ROL_GESTOR */
function getUsuariosRoLGestor(req, res){

  // VERIFICADOR
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_GESTOR'}, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados});
  })
}

/* Ver usuario propio del ROL_GESTOR*/
function getUsuarioIdRolGestor(req, res){
  if(req.user.rol!== 'ROL_ADMIN'){
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción"});
  }
  // buscar por id
  var idFacturador = req.params.ID;

  Usuarios.findById(idFacturador, (err, usuariosEncontrados)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios"});
    return res.status(200).send({ usuario: usuariosEncontrados})
  })
}

/* Siempre mandar a llamar a las funciones aqui */
module.exports = {
    Login,
    agregarUsuario,
    /*MODULOS CLIENTE*/
    editarUsuarioRolCliente,
    eliminarUsuarioRolCliente,
    getUsuariosRolCliente,
    getUsuarioIdRolCliente,
    /*MODULOS ADMINISTRADOR*/ 
    editarUsuarioRolAdmin,
    agregarFacturador,
    agregarEmpleado,
    agregarGestor,
    getUsuariosRolFacturador,
    getUsuariosRolEmpleado,
    getUsuariosRolGestor,
    getUsuarioIdRolAdministrador,
    /*MODULOS FACTURADOR*/
    editarUsuarioRolFacturador,
    eliminarUsuarioRolFacturador,
    getUsuariosRolFacturador,
    getUsuarioIdRolFacturador,
    /*MODULO GESTOR*/
    editarUsuarioRolGestor,
    eliminarUsuarioRolGestor,
    getUsuariosRoLGestor,
    getUsuarioIdRolGestor,
    agregarClienteRolAdmin
}



