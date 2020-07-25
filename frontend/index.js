function mostrarResultados(resultados) {
    Object.keys(resultados).forEach(error => {
        const field = `#${error}`;
        $(field).addClass("is-invalid")
            .after(`
                <small id="passwordHelp" class="text-danger">
                    Must be 8-20 characters long.
                </small>`
            );
    });
}

function mostrarErrores(errores) {
    console.log(errores);
    errores.forEach(error => {
        $(`#${error}`).addClass("is-invalid");
    });
}

function buscarCajeros() {
    const data = {
        red: $("#red").val(),
        latitud: $("#latitud").val(),
        longitud: $("#longitud").val()
    };

    fetch("http://localhost:3000/cajeros?" + $.param(data))
        .then(respuesta => respuesta.json())
        .then(resultados => mostrarResultados(resultados))
        .catch(errores => mostrarErrores(errores));
}
