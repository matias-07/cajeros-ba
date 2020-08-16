const fs = require("fs");
const csv = require("csv-parser");

module.exports = (filepath) => {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(filepath)
            .on("error", (error) => reject(error))
            .pipe(csv())
            .on("data", (row) => rows.push(row))
            .on("end", () => resolve(rows));
    });
};
