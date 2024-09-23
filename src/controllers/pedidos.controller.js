const Pedidos = require('../models/pedidos.model');
const Carritos = require('../models/carritos.model');

function generarPedido(req, res) {

    // Verifica si el usuario está autenticado
    if (req.user.rol !== 'ROL_CLIENTE') {
        return res.status(500).send({ mensaje: "Únicamente el ROL_CLIENTE puede realizar esta acción." });
    }
    
    const idCarrito = req.params.idCarrito; // Obtén el ID del carrito desde los parámetros de la solicitud
    
    const { tipoPago, direccionEnvio, fechaEntrega, metodoEnvio } = req.body; // Obtén los datos necesarios del cuerpo de la solicitud

    
    
    // Busca el carrito del usuario
    Carritos.findById(idCarrito, (err, carritoEncontrado) => {
        if (err || !carritoEncontrado) {
            return res.status(404).send({ mensaje: 'Carrito no encontrado' });
        }

        // Crea el nuevo pedido
        const nuevoPedido = new Pedidos({
            fecha: new Date(), // Fecha actual
            tiempoEstimado: '30-45 minutos', // Establece un tiempo estimado por defecto
            tipoPago: tipoPago,
            estado: 'En espera',
            direccionEnvio: direccionEnvio,
            fechaEntrega: fechaEntrega,
            horaEntrega: null,
            metodoEnvio: metodoEnvio,
            descuentos: null,
            numeroDeOrden: 0, // Se generará automáticamente
            pagoConfirmado: null,
            idUsuario: req.user.sub, // ID del usuario
            compras: carritoEncontrado.compras, // Copia los datos de compras del carrito
            total: carritoEncontrado.total // Copia el total del carrito
        });

        // Generar el número de orden automáticamente
        Pedidos.countDocuments({}, (err, count) => {
            if (err) return res.status(500).send({ mensaje: 'Error al contar los pedidos' });
            nuevoPedido.numeroDeOrden = count + 1; // Sumar 1 al contador para el nuevo número de orden

            // Guarda el nuevo pedido en la base de datos
            nuevoPedido.save((err, pedidoGuardado) => {
                if (err) return res.status(500).send({ mensaje: 'Error al guardar el pedido' });
                return res.status(200).send({ mensaje: 'Pedido generado con éxito', pedido: pedidoGuardado });
            });
        });
    });
}



module.exports = {

    generarPedido
}
