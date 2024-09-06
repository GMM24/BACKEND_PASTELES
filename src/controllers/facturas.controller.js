

const Facturas = require('../models/facturas.model');
const Carritos = require('../models/carritos.model');
const Productos = require('../models/productos.model');
const GenerarPDF = require('../generarPDF/generarPDF');

function GenerarFactura(req,res){
    var parametros = req.body;
    if (req.user.rol !== 'ROL_CLIENTE') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_CLIENTE puede realizar esta acción " });
    }

    Carritos.findOne({idUsuario:req.user.sub},(err, carritoUsuario)=>{
        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
        if(!carritoUsuario) return res.status(500).send({ mensaje:"El usuario no posee carritos, no puede acceder a crear facturas, debe crear un carrito"})
        if(carritoUsuario.compras.length==0) return res.status(500).send({mensaje:"No existen productos en el carrito del usuario "})

        
        if(!parametros.nit||parametros.nit==""){
            return res.status(500).send({ mensaje:"Debe llenar el campo nit para generar la factura"})
        }else{


            for (let i = 0; i <carritoUsuario.compras.length;i++){
                //console.log("ENtra a ford ")
                Productos.findOne({_id:carritoUsuario.compras[i].idProducto},(err,productoVerificacion)=>{
                    if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                    if(!carritoUsuario) return res.status(500).send({ mensaje:"Busqeuda de producto inexistente"})

                    if(carritoUsuario.compras[i].cantidad>productoVerificacion.stock){
                        //console.log("PROCESO ANULADO ")


                        return res.status(500).send({ factura:"PROCESO DE FACTURACIÓN ANULADO",advertencia:"Su carrito posee el producto "+
                        carritoUsuario.compras[i].nombreProducto+" con una cantidad mayor al stock actual. ",
                        mensaje:"Debe editar la cantidad de su carrito o eliminar el producto de su compra para generar una nueva factura."})
                    }else{
                        

                        if ( carritoUsuario.idUsuario == req.user.sub){
                           
                            var restarStock = (carritoUsuario.compras[i].cantidad * -1)
                            ////console.log(restarStock)
                            var cantidadVendido = carritoUsuario.compras[i].cantidad
                                    Productos.findByIdAndUpdate(carritoUsuario.compras[i].idProducto, { $inc : { stock: restarStock,vendido:cantidadVendido } }, { new: true },
                                        (err, productoModificado) => {
                                            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar editar productos'});
                                            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})


                                    })
                                    

                        }else{
                            return res.status(200).send({mensaje:"Verifique los datos de su carrito",})
                        }
                    }

                })

            }

            const modelFactura = new Facturas()
            modelFactura.nit = parametros.nit
            modelFactura.fecha =  (new Date())
            modelFactura.compras = carritoUsuario.compras
            modelFactura.total =carritoUsuario.total
            modelFactura.idUsuario = req.user.sub
            let limpiarCarrito = []
            Carritos.findOneAndUpdate({_id:carritoUsuario._id},  { compras: limpiarCarrito , total: 0 }, { new: true }, 
                (err, carritoVacio)=>{

                modelFactura.save((err,agregarFactura)=>{  
                                       
                    if(err) return res.status(500).send({ mensaje:"Erro, no se puede guardar el carrito"})
                    if(!agregarFactura) return res.status(500).send({ mensaje:"No se puede guardar el carrito"})
                 

                })
            })
            
        }

    })
}

//esta es la que funciona
function CrearFacturaCliente(req, res) {
    const parametros = req.body;

    if (req.user.rol !== 'ROL_CLIENTE') {
        return res.status(500).send({ mensaje: "Unicamente el ROL_CLIENTE puede realizar esta acción" });
    }

    Carritos.findOne({ idUsuario: req.user.sub }, (err, carritoUsuario) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!carritoUsuario) return res.status(500).send({ mensaje: "El usuario no posee carritos, no puede acceder a crear facturas, debe crear un carrito" });
        if (carritoUsuario.compras.length === 0) return res.status(500).send({ mensaje: "No existen productos en el carrito del usuario" });

        if (!parametros.nit || parametros.nit === "") {
            return res.status(500).send({ mensaje: "Debe llenar el campo nit para generar la factura" });
        }

        const productPromises = carritoUsuario.compras.map((compra) => {
            return Productos.findOne({ _id: compra.idProducto }).then(productoVerificacion => {
                if (!productoVerificacion) {
                    return Promise.reject({ mensaje: "Búsqueda de producto inexistente" });
                }

                if (compra.cantidad > productoVerificacion.stock) {
                    return Promise.reject({
                        factura: "PROCESO DE FACTURACIÓN ANULADO",
                        advertencia: "Su carrito posee el producto " + compra.nombreProducto + " con una cantidad mayor al stock actual.",
                        mensaje: "Debe editar la cantidad de su carrito o eliminar el producto de su compra para generar una nueva factura."
                    });
                }

                // Actualizar el stock
                const restarStock = compra.cantidad * -1;
                const cantidadVendido = compra.cantidad;
                return Productos.findByIdAndUpdate(compra.idProducto, { $inc: { stock: restarStock, vendido: cantidadVendido } }, { new: true });
            });
        });

        Promise.all(productPromises)
            .then(() => {
                const modelFactura = new Facturas();
                modelFactura.nit = parametros.nit;
                modelFactura.fecha = new Date();
                modelFactura.compras = carritoUsuario.compras;
                modelFactura.total = carritoUsuario.total;
                modelFactura.idUsuario = req.user.sub;

                // Limpiar el carrito
                return Carritos.findOneAndUpdate({ _id: carritoUsuario._id }, { compras: [], total: 0 }, { new: true })
                    .then(() => {
                        return modelFactura.save();
                    });
            })
            .then((agregarFactura) => {
                // Generar el PDF después de guardar la factura
                GenerarPDF.facturasPDF(carritoUsuario.idUsuario, agregarFactura._id);

                // Enviar la respuesta al cliente
                return res.status(200).send({ mensaje: "Factura generada exitosamente", factura: agregarFactura, PDF: "El PDF del usuario se ha creado exitosamente" });
            })
            .catch(error => {
                if (error.mensaje) {
                    return res.status(500).send(error);
                }
                return res.status(500).send({ mensaje: "Error en la petición" });
            });
    });
}

module.exports={
    GenerarFactura,
    CrearFacturaCliente
}





