const leerCSV = require("./lectorCSV");

function Cajero(atributos) {
    this.longitud = Number(atributos["long"]);
    this.latitud = Number(atributos["lat"]);
    this.red = atributos["red"];
    this.banco = atributos["banco"];
    this.direccion = atributos["ubicacion"];
    this.distanciaA = (latitud, longitud) => {
        const R = 6371;
        const deltaLatitud = (this.latitud - latitud) * (Math.PI / 180);
        const deltaLongitud = (this.longitud - longitud) * (Math.PI / 180);
        const latitud1 = this.latitud * (Math.PI / 180);
        const latitud2 = latitud * (Math.PI / 180);
        const a = Math.sin(deltaLatitud / 2) ** 2
            + Math.cos(latitud1) * Math.cos(latitud2) * (Math.sin(deltaLongitud / 2) ** 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    };
}

module.exports = {
    archivo: "./cajeros-automaticos.csv",
    cajeros: null,
    constructor: function(atributos) {
        return new Cajero(atributos);
    },
    obtenerCajeros: async function() {
        if (this.cajeros) {
            return this.cajeros;
        }
        const cajeros = await leerCSV(this.archivo);
        return cajeros.map(this.constructor);
    },
    obtenerPorRed: async function(red) {
        const cajeros = await this.obtenerCajeros();
        return cajeros.filter(cajero => cajero.red === red);
    },
    obtenerMasCercanos: async function(latitud, longitud, red, cantidad, maximaDistancia) {
        cantidad = cantidad || 3;
        maximaDistancia = maximaDistancia || 1500; // cambiar a 500
        const cajeros = await this.obtenerPorRed(red);
        return cajeros
            .filter(cajero => cajero.distanciaA(latitud, longitud) < maximaDistancia)
            .sort((a, b) => a.distanciaA(latitud, longitud) - b.distanciaA(latitud, longitud))
            .slice(0, cantidad);
    }
};
