const express = require("express");
const router = express.Router();
const Cajero = require("../models/Cajero");
const reCaptcha = require("../middlewares/reCaptcha");

// Mensajes de errores
const errorValorRequerido = "Valor requerido";
const errorValorNoNumerico = "El valor debe ser numérico";
const serverError = "Ha ocurrido un error";

router.get("/", async (req, res) => {
    const {red, latitud, longitud} = req.query;
    const errores = {};

    if (!red) {
        errores["red"] = errorValorRequerido;
    }

    if (!latitud) {
        errores["latitud"] = errorValorRequerido;
    } else if (isNaN(latitud)) {
        errores["latitud"] = errorValorNoNumerico;
    }

    if (!longitud) {
        errores["longitud"] = errorValorRequerido;
    } else if (isNaN(longitud)) {
        errores["longitud"] = errorValorNoNumerico;
    }

    if (Object.keys(errores).length > 0) {
        return res.status(400).json(errores);
    }

    try {
        const cajeros = await Cajero.obtenerMasCercanos(
            Number(latitud),
            Number(longitud),
            red.toUpperCase()
        );
        res.status(200).json(
            cajeros.map(result => {
                return {
                    latitud: result["latitud"],
                    longitud: result["longitud"],
                    direccion: result["direccion"],
                    banco: result["banco"],
                };
            })
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: serverError
        });
    }
});

module.exports = router;
