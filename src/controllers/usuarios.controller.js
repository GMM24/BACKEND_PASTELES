// CONTROLLER USUARIOS AXEL ALVAREZ
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


// USUARIO POR DEFECTO Y VERIFICACION
// USUARIO POR DEFECTO Y VERIFICACION
function Login(req, res) {

  var parametros = req.body;

  Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
    if (usuarioEncontrado) {
      bcrypt.compare(parametros.password, usuarioEncontrado.password,
        (err, verificacionPassword) => {
          if (verificacionPassword) {

            if (parametros.obtenerToken === 'true') {

              return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })

            } else {
              usuarioEncontrado.password = undefined;
              return res.status(200).send({ usuario: usuarioEncontrado })
            }
          } else {
            return res.status(500).send({ mensaje: 'La contraseña es incorrecta' });
          }
        })
    } else {
      return res.status(500).send({ mensaje: 'El correo no esta asignado' })
    }
  })
}


function agregarUsuario(req, res) {

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_CLIENTE';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;



    //Verificacion de email
    Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar el cliente" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}

/* TAREAS DEL ROL_CLIENTE */

// 1. editar usuario
function editarUsuarioRolCliente(req, res) {

  // Verificar el rol de usuario
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idCliente = req.params.ID;

  // Verificar si se está intentando cambiar el email
  if (parametros.email) {
    // Buscar si el email ya existe en otro usuario
    Usuarios.findOne({ email: parametros.email, _id: { $ne: idCliente } }, (err, emailExistente) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (emailExistente) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      // Si el email no existe, proceder a actualizar
      Usuarios.findByIdAndUpdate(idCliente, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
        return res.status(200).send({ usuario: usuarioEncontrado });
      });
    });
  } else {
    // Si no se proporciona un nuevo email, proceder a actualizar directamente
    Usuarios.findByIdAndUpdate(idCliente, parametros, { new: true }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
      return res.status(200).send({ usuario: usuarioEncontrado });
    });
  }
}

// 2. eliminar usuario
function eliminarUsuarioRolCliente(req, res) {

  // siempre poner esto al principio, es para verificar quien puede realizar la acción
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var idCliente = req.params.ID;
  Usuarios.findByIdAndDelete(idCliente, (err, eliminarRolUsuario) => {

    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!eliminarRolUsuario) return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
    return res.status(200).send({ usuario: eliminarRolUsuario });

  });

}

// 3. ver a usuarios con ROL_CLIENTE, en este caso es un ejemplo que debera de aplicarse a ROL_ADMIN
function getUsuariosRolCliente(req, res) {

  // VERIFICADOR
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_CLIENTE' }, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados });
  })
}

/* 4. ver a un perfil que tenga ROL_CLIENTE por el ID*/
function getUsuarioIdRolCliente(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }


  // buscar por id
  var idCliente = req.params.ID;

  Usuarios.findById(idCliente, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados })
  })
}


/* TAREAS DEL ROL_ADMIN */
/* 1. editar perfil */
function editarUsuarioRolAdmin(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var idAdmin = req.params.ID;
  Usuarios.findByIdAndUpdate(idAdmin, parametros, { new: true }, (err, adminEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (!adminEncontrado) return res.status(500).send({ mensaje: "Error al editar el Administrador" });
    return res.status(200).send({ usuario: adminEncontrado });

  })
}


/* 2. agregar, ROL_FACTURADOR por defecto */
function agregarClienteRolAdmin(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_CLIENTE';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;


    //Verificacion de email
    Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar el cliente" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}

/* 2. agregar, ROL_FACTURADOR por defecto */
function agregarFacturador(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_FACTURADOR';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;


    //Verificacion de email
    Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar el cliente" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}
/* 3. agregar, ROL_EMPLEADO por defecto */
function agregarEmpleado(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_EMPLEADO';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;

    Usuarios.find({ email: parametros.email }, (err, empleadoGuardado) => {
      if (empleadoGuardado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, empleadoGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!empleadoGuardado) return res.status(500).send({ mensaje: "Error al agregar el empleado" });

            return res.status(200).send({ usuario: empleadoGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}
/* 4. agregar, ROL_GESTOR por defecto */
function agregarGestor(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_GESTOR';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;

    Usuarios.find({ email: parametros.email }, (err, gestorGuardado) => {
      if (gestorGuardado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, gestorGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!gestorGuardado) return res.status(500).send({ mensaje: "Error al agregar el empleado" });

            return res.status(200).send({ usuario: gestorGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}



/* 5. ver usuarios con ROL_FACTURADOR  funcion 3*/
function getUsuariosRolFacturador(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_FACTURADOR' }, (err, facturadorEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!facturadorEncontrado) return res.status(500).send({ mensaje: "Error al ver los facturadores" });
    return res.status(200).send({ usuario: facturadorEncontrado });
  })
}

/* 6.  ver usuarios con unicamente ROL_EMPLEADO  */
function getUsuariosRolEmpleado(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_EMPLEADO' }, (err, empleadoEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!empleadoEncontrado) return res.status(500).send({ mensaje: "Error al ver los empleados" });
    return res.status(200).send({ usuario: empleadoEncontrado });
  })
}
/* 7. ver usuarios con ROL_GESTOR */
function getUsuariosRolGestor(req, res) {

  // VERIFICADOR
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_GESTOR' }, (err, gestorEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!gestorEncontrado) return res.status(500).send({ mensaje: "Error al ver los gestores de inventario" });
    return res.status(200).send({ usuario: gestorEncontrado });
  })
}

/* 8. ver propio usuario por ID*/
function getUsuarioIdRolAdministrador(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  // buscar por id
  var idAdministrador = req.params.ID;

  Usuarios.findById(idAdministrador, (err, administradorEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!administradorEncontrado) return res.status(500).send({ mensaje: "Error al ver los administradores" });
    return res.status(200).send({ usuario: administradorEncontrado })
  })
}


/* TAREAS DEL ROL_FACTURADOR */
/* Editar usuario */
function editarUsuarioRolFacturador(req, res) {
  // Verificar el rol de usuario
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idFacturador = req.params.ID;

  // Verificar si se está intentando cambiar el email
  if (parametros.email) {
    // Buscar si el email ya existe en otro usuario
    Usuarios.findOne({ email: parametros.email, _id: { $ne: idFacturador } }, (err, emailExistente) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (emailExistente) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      // Si el email no existe, proceder a actualizar
      Usuarios.findByIdAndUpdate(idFacturador, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
        return res.status(200).send({ usuario: usuarioEncontrado });
      });
    });
  } else {
    // Si no se proporciona un nuevo email, proceder a actualizar directamente
    Usuarios.findByIdAndUpdate(idFacturador, parametros, { new: true }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
      return res.status(200).send({ usuario: usuarioEncontrado });
    });
  }
}

/* Eliminar usuario*/
function eliminarUsuarioRolFacturador(req, res) {

  // siempre poner esto al principio, es para verificar quien puede realizar la acción
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var idFacturador = req.params.ID;
  Usuarios.findByIdAndDelete(idFacturador, (err, eliminarRolUsuario) => {

    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!eliminarRolUsuario) return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
    return res.status(200).send({ usuario: eliminarRolUsuario });
  });

}

/* Ver usuarios con el ROL_FACTURADOR */
function getUsuariosRolFacturador(req, res) {

  // VERIFICADOR
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_FACTURADOR' }, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados });
  })
}

/* Ver usuario propio del ROL_FACTURADOR*/
function getUsuarioIdRolFacturador(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }
  // buscar por id
  var idFacturador = req.params.ID;

  Usuarios.findById(idFacturador, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados })
  })
}

// 1. editar usuario
// 2 eliminar usuario
// 3 ver usuarios
// 4 ver propio usuario

/*TAREAS DE ROL GESTOR*/
function editarUsuarioRolGestor(req, res) {
  // Verificar el rol de usuario
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idGestor = req.params.ID;

  // Verificar si se está intentando cambiar el email
  if (parametros.email) {
    // Buscar si el email ya existe en otro usuario
    Usuarios.findOne({ email: parametros.email, _id: { $ne: idGestor } }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (usuarioEncontrado) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      // Si el email no existe, proceder a actualizar
      Usuarios.findByIdAndUpdate(idGestor, parametros, { new: true }, (err, gestoresEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!gestoresEncontrados) return res.status(404).send({ mensaje: "Error al editar el gestor" });
        return res.status(200).send({ usuario: gestoresEncontrados });
      });
    });
  } else {
    // Si no se proporciona un nuevo email, proceder a actualizar
    Usuarios.findByIdAndUpdate(idGestor, parametros, { new: true }, (err, gestoresEncontrados) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!gestoresEncontrados) return res.status(404).send({ mensaje: "Error al editar el gestor" });
      return res.status(200).send({ usuario: gestoresEncontrados });
    });
  }
}
/*eliminar perfil de gestor*/
function eliminarUsuarioRolGestor(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción " });
  }

  var idGestor = req.params.ID;
  Usuarios.findByIdAndDelete(idGestor, (err, eliminarRolGestor) => {

    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!editarUsuarioRolGestor) return res.status(500).send({ mensaje: "Error al eliminar el gestor" });
    return res.status(200).send({ usuario: eliminarRolGestor });

  });

}
/* Ver usuarios con el ROL_GESTOR */
function getUsuariosRoLGestor(req, res) {

  // VERIFICADOR
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados });
  })
}

/* Ver usuario propio del ROL_GESTOR*/
function getUsuarioIdRolGestor(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }
  // buscar por id
  var idFacturador = req.params.ID;

  Usuarios.findById(idFacturador, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados })
  })
}


/* agregar ROL_REPARTIDOR por defecto */
function agregarRepartidor(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_REPARTIDOR';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;

    Usuarios.find({ email: parametros.email }, (err, gestorGuardado) => {
      if (gestorGuardado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, gestorGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!gestorGuardado) return res.status(500).send({ mensaje: "Error al agregar el empleado" });

            return res.status(200).send({ usuario: gestorGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}

// 2. eliminar usuario
function eliminarUsuarioRolRepartidor(req, res) {

  // siempre poner esto al principio, es para verificar quien puede realizar la acción
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var idRepartidor = req.params.ID;
  Usuarios.findByIdAndDelete(idRepartidor, (err, eliminarRolUsuario) => {

    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!eliminarRolUsuario) return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
    return res.status(200).send({ usuario: eliminarRolUsuario });

  });

}

function editarUsuarioRolRepartidor(req, res) {

  // Verificar el rol de usuario
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idRepartidor = req.params.ID;

  // Verificar si se está intentando cambiar el email
  if (parametros.email) {
    // Buscar si el email ya existe en otro usuario
    Usuarios.findOne({ email: parametros.email, _id: { $ne: idRepartidor } }, (err, emailExistente) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (emailExistente) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      // Si el email no existe, proceder a actualizar
      Usuarios.findByIdAndUpdate(idRepartidor, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
        return res.status(200).send({ usuario: usuarioEncontrado });
      });
    });
  } else {
    // Si no se proporciona un nuevo email, proceder a actualizar directamente
    Usuarios.findByIdAndUpdate(idRepartidor, parametros, { new: true }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
      return res.status(200).send({ usuario: usuarioEncontrado });
    });
  }
}

function getUsuariosRolRepartidor(req, res) {

  // VERIFICADOR
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  // verificar que tipo de usuario quiero ver
  Usuarios.find({ rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados });
  })
}


function getUsuarioIdRolRepartidor(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }
  // buscar por id
  var idRepartidor = req.params.ID;

  Usuarios.findById(idRepartidor, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los usuarios" });
    return res.status(200).send({ usuario: usuariosEncontrados })
  })
}


//CAJERO

function agregarUsuarioCajero(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }
  var parametros = req.body;
  var usuarioModel = new Usuarios();
  if (parametros.nombre && parametros.apellido && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.apellido = parametros.apellido;
    usuarioModel.email = parametros.email;
    usuarioModel.password = parametros.password;
    usuarioModel.rol = 'ROL_CAJERO';
    usuarioModel.telefono = parametros.telefono;
    usuarioModel.direccion = parametros.direccion;
    usuarioModel.departamento = parametros.departamento;
    usuarioModel.municipio = parametros.municipio;
    usuarioModel.imagen = null;


    Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
          usuarioModel.password = passwordEncriptada;



          usuarioModel.save((err, usuarioGuardado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioGuardado) return res.status(500).send({ mensaje: "Error al agregar Cajero" });

            return res.status(200).send({ usuario: usuarioGuardado });
          });
        });
      } else {
        return res.status(500).send({ mensaje: "Correo Existente, ingrese uno nuevo" });
      }

    })
  } else {
    return res.status(500).send({ mensaje: "Complete los campos obligatorios" });
  }
}

function editarUsuarioCajero(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idCajero = req.params.ID;

  if (parametros.email) {

    Usuarios.findOne({ email: parametros.email, _id: { $ne: idRepartidor } }, (err, emailExistente) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (emailExistente) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      Usuarios.findByIdAndUpdate(idCajero, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar Cajero" });
        return res.status(200).send({ usuario: usuarioEncontrado });
      });
    });
  } else {

    Usuarios.findByIdAndUpdate(idCajero, parametros, { new: true }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar Cajero" });
      return res.status(200).send({ usuario: usuarioEncontrado });
    });
  }
}

function eliminarUsuarioCajero(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  var idCajero = req.params.ID;
  Usuarios.findByIdAndDelete(idCajero, (err, eliminarCajero) => {

    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!eliminarCajero) return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
    return res.status(200).send({ usuario: eliminarCajero });

  });
}

function getUsuarioCajero(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });

  }

  Usuarios.find({ rol: 'ROL_CAJERO' }, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver los Cajeros" });
    return res.status(200).send({ usuario: usuariosEncontrados });
  })
}


function getUsuarioIdCajero(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(500).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var idCajero = req.params.ID;

  Usuarios.findById(idCajero, (err, usuariosEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!usuariosEncontrados) return res.status(500).send({ mensaje: "Error al ver el Cajero" });
    return res.status(200).send({ usuario: usuariosEncontrados })
  })
}

/* IMPLEMENTANDO VER USUARIOS POR DEPARTAMENTO */
/* ROL GESTOR VER POR DEPARTAMENTO  */
function getGestorGuatemala(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Guatemala', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorAltaVerapaz(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Alta Verapaz', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorBajaVerapaz(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Baja Verapaz', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorChimaltenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Chimaltenango', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorChiquimula(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Chiquimula', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorElProgreso(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'El Progreso', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorEscuintla(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Escuintla', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getGestorHuehuetenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Huehuetenango', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorIzabal(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Izabal', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorJalapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Jalapa', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorJutiapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Jutiapa', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorPeten(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Petén', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorQuetzaltenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Quetzaltenango', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorQuiche(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Quiché', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorRetalhuleu(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Retalhuleu', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorSacatepequez(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Sacatepequez', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorSanMarcos(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'San Marcos', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorSantaRosa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Santa Rosa', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorSolola(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Sololá', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorSuchitepequez(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Suchitepequez', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorTotonicapan(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Totonicapan', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getGestorZacapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Zacapa', rol: 'ROL_GESTOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

/*ROL REPARTIDOR*/
function getRepartidorGuatemala(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Guatemala', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorAltaVerapaz(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Alta Verapaz', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorBajaVerapaz(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Baja Verapaz', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorChimaltenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Chimaltenango', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorChiquimula(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Chiquimula', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorElProgreso(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'El Progreso', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorEscuintla(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Escuintla', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorHuehuetenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Huehuetenango', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}


function getRepartidorIzabal(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Izabal', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorJalapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Jalapa', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorJutiapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Jutiapa', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorPeten(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Petén', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorQuetzaltenango(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Quetzaltenango', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorQuiche(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Quiché', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorRetalhuleu(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Retalhuleu', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorSacatepequez(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Sacatepéquez', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorSanMarcos(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'San Marcos', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorSantaRosa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Santa Rosa', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorSolola(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Solola', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorSuchitepequez(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Suchitepequez', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorTotonicapan(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Totonicapan', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}

function getRepartidorZacapa(req, res) {
  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Únicamente el ROL_ADMIN puede realizar esta acción" });
  }

  Usuarios.find({ departamento: 'Zacapa', rol: 'ROL_REPARTIDOR' }, (err, usuariosEncontrados) => {
    if (err) {
      return res.status(500).send({ mensaje: "Error en la petición" });
    }

    if (!usuariosEncontrados || usuariosEncontrados.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron usuarios para este departamento" });
    }

    return res.status(200).send({ usuarios: usuariosEncontrados });
  });
}
function editarPerfilAdmin(req, res) {

  if (req.user.rol !== 'ROL_ADMIN') {
    return res.status(403).send({ mensaje: "Unicamente el ROL_ADMIN puede realizar esta acción" });
  }

  var parametros = req.body;
  var idAdmin = req.params.ID;

  // Verificar si se está intentando cambiar el email
  if (parametros.email) {
    // Buscar si el email ya existe en otro usuario
    Usuarios.findOne({ email: parametros.email, _id: { $ne: idAdmin } }, (err, emailExistente) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (emailExistente) {
        return res.status(400).send({ mensaje: "El email ya está en uso por otro usuario." });
      }

      // Si el email no existe, proceder a actualizar
      Usuarios.findByIdAndUpdate(idAdmin, parametros, { new: true }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
        return res.status(200).send({ usuario: usuarioEncontrado });
      });
    });
  } else {
    // Si no se proporciona un nuevo email, proceder a actualizar directamente
    Usuarios.findByIdAndUpdate(idAdmin, parametros, { new: true }, (err, usuarioEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la petición" });
      if (!usuarioEncontrado) return res.status(404).send({ mensaje: "Error al editar el cliente" });
      return res.status(200).send({ usuario: usuarioEncontrado });
    });
  }
}



/* AGREGAR ROL REPARTIDOR */
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
  agregarClienteRolAdmin,
  agregarRepartidor,
  eliminarUsuarioRolRepartidor,
  editarUsuarioRolRepartidor,
  getUsuariosRolRepartidor,
  getUsuarioIdRolRepartidor,
  /*MODULO CAJERO*/
  agregarUsuarioCajero,
  editarUsuarioCajero,
  eliminarUsuarioCajero,
  getUsuarioCajero,
  getUsuarioIdCajero,
  /*ROL GESTOR POR DEPARTAMENTO */
  getGestorGuatemala,
  getGestorAltaVerapaz,
  getGestorBajaVerapaz,
  getGestorChimaltenango,
  getGestorChiquimula,
  getGestorElProgreso,
  getGestorEscuintla,
  getGestorHuehuetenango,
  getGestorIzabal,
  getGestorJalapa,
  getGestorJutiapa,
  getGestorPeten,
  getGestorQuetzaltenango,
  getGestorQuiche,
  getGestorRetalhuleu,
  getGestorSacatepequez,
  getGestorSanMarcos,
  getGestorSantaRosa,
  getGestorSolola,
  getGestorSuchitepequez,
  getGestorTotonicapan,
  getGestorZacapa,
  /*ROL REPARTIDOR POR DEPARTAMENTO */
  getRepartidorGuatemala,
  getRepartidorAltaVerapaz,
  getRepartidorBajaVerapaz,
  getRepartidorChimaltenango,
  getRepartidorChiquimula,
  getRepartidorElProgreso,
  getRepartidorEscuintla,
  getRepartidorHuehuetenango,
  getRepartidorIzabal,
  getRepartidorJalapa,
  getRepartidorJutiapa,
  getRepartidorPeten,
  getRepartidorQuetzaltenango,
  getRepartidorQuiche,
  getRepartidorRetalhuleu,
  getRepartidorSacatepequez,
  getRepartidorSanMarcos,
  getRepartidorSantaRosa,
  getRepartidorSolola,
  getRepartidorSuchitepequez,
  getRepartidorTotonicapan,
  getRepartidorZacapa

}



