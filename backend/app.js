const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const { urlencoded, json } = require("body-parser");
const cajeros = require("./cajeros");

// Mensajes de errores
const errorValorRequerido = "Valor requerido";
const errorValorNoNumerico = "El valor debe ser numérico";
app.use(cors());
app.use(urlencoded({extended: false}));
app.use(json());

app.get("/cajeros", async (req, res) => {
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
        const resultado = await cajeros
            .obtenerMasCercanos(
                Number(latitud),
                Number(longitud),
                red.toUpperCase()
            );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`Escuchando en puerto ${port}`);
});
