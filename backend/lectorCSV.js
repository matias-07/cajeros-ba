const fs = require("fs");
const csv = require("csv-parser");

module.exports = (rutaArchivo) => {
    return new Promise((resolve, reject) => {
        let filas = [];

        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => filas.push(fila))
            .on("end", () => resolve(filas));
    });
}
