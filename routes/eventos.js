import express from 'express';
import Evento from '../models/evento.js';

const router = express.Router();

// GET /eventos: Devuelve todos los eventos usando .populate('recinto')
router.get('/', async (req, res) => {
    try {
        const resultado = await Evento.find().populate('recinto');
        if (!resultado || resultado.length === 0) {
            return res.status(500).json({
                ok: false,
                error: "No se han encontrado eventos"
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "No se han encontrado eventos"
        });
    }
});

// GET /eventos/localidad/:nombre: Filtra por localidad (usando populate) y fecha mayor a la actual
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const eventos = await Evento.find({
            fecha: { $gt: new Date() }
        }).populate('recinto');

        const resultado = eventos.filter(
            (evento) => evento.recinto && evento.recinto.localidad === req.params.nombre
        );

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "No se han encontrado eventos"
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: "No se han encontrado eventos"
        });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada: Devuelve SOLO { precio, disponibles }
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
            });
        }

        const entrada = evento.entradas.find(
            (e) => e.tipo === req.params.tipoEntrada
        );

        if (!entrada) {
            return res.status(404).json({
                ok: false,
                error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
            });
        }

        res.status(200).json({
            ok: true,
            resultado: {
                precio: entrada.precio,
                disponibles: entrada.disponibles
            }
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
        });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad: Resta la cantidad a las disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const cantidad = Number(req.params.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });
        }

        const evento = await Evento.findById(req.params.idEvento);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });
        }

        const entrada = evento.entradas.find(
            (e) => e.tipo === req.params.tipoEntrada
        );

        if (!entrada || entrada.disponibles < cantidad) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando entradas del evento ${req.params.idEvento}`
            });
        }

        entrada.disponibles -= cantidad;
        const resultado = await evento.save();

        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error actualizando entradas del evento ${req.params.idEvento}`
        });
    }
});

// GET /eventos/:id: Devuelve un evento por su ID
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findById(req.params.id);
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                error: `Evento ${req.params.id} no encontrado`
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Evento ${req.params.id} no encontrado`
        });
    }
});

// POST /eventos: Crea un nuevo evento
router.post('/', async (req, res) => {
    try {
        const nuevoEvento = new Evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            entradas: req.body.entradas,
            recinto: req.body.recinto
        });
        const resultado = await nuevoEvento.save();
        res.status(201).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error añadiendo evento"
        });
    }
});

// PUT /eventos/:id: Actualiza un evento existente
router.put('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                error: `Error actualizando evento ${req.params.id}`
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error actualizando evento ${req.params.id}`
        });
    }
});

// DELETE /eventos/:id: Elimina un evento por su ID
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Evento.findByIdAndDelete(req.params.id);
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                error: `Error eliminando evento ${req.params.id}`
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error eliminando evento ${req.params.id}`
        });
    }
});

export default router;
