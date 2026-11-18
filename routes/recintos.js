import express from 'express';
import Recinto from '../models/recinto.js';

const router = express.Router();

// GET /recintos: Devuelve todos los recintos
router.get('/', async (req, res) => {
    try {
        const resultado = await Recinto.find();
        if (!resultado || resultado.length === 0) {
            return res.status(500).json({
                ok: false,
                error: "No se han encontrado recintos"
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "No se han encontrado recintos"
        });
    }
});

// GET /recintos/localidad/:nombre: Filtra recintos por localidad
router.get('/localidad/:nombre', async (req, res) => {
    try {
        const resultado = await Recinto.find({ localidad: req.params.nombre });
        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "No se han encontrado recintos de la localidad indicada"
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: "No se han encontrado recintos de la localidad indicada"
        });
    }
});

// GET /recintos/:id: Devuelve un recinto por su ID
router.get('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findById(req.params.id);
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                error: `Recinto ${req.params.id} no encontrado`
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Recinto ${req.params.id} no encontrado`
        });
    }
});

// POST /recintos: Crea un nuevo recinto
router.post('/', async (req, res) => {
    try {
        const nuevoRecinto = new Recinto({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });
        const resultado = await nuevoRecinto.save();
        res.status(201).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error añadiendo recinto"
        });
    }
});

// DELETE /recintos/:id: Elimina un recinto por su ID
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Recinto.findByIdAndDelete(req.params.id);
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                error: `Error eliminando recinto ${req.params.id}`
            });
        }
        res.status(200).json({
            ok: true,
            resultado: resultado
        });
    } catch (error) {
        res.status(404).json({
            ok: false,
            error: `Error eliminando recinto ${req.params.id}`
        });
    }
});

export default router;
