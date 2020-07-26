function mensajeDeError(mensaje) {
    return $("<small/>", {
        class: "text-danger",
        text: mensaje
    });
}

function limpiarErrores() {
    $(".is-invalid").removeClass("is-invalid");
    $(".text-danger").remove();
}

function crearResultado(cajero) {
    const card = $("<div/>", {
        class: "card mt-3 collapse"
    });
    const cardBody = $("<div/>", {
        class: "card-body"
    });
    const cardTitle = $("<h5/>", {
        class: "card-title",
        text: cajero["banco"]
    });
    const cardSubtitle = $("<h6/>", {
        class: "card-subtitle mb-2 text-muted",
        text: cajero["latitud"] + ", " + cajero["longitud"]
    });
    const cardText = $("<p/>", {
        class: "card-text",
        text: cajero["direccion"]
    });

    cardBody.append(cardTitle)
        .append(cardSubtitle)
        .append(cardText);
    card.append(cardBody);
    
    return card;
}

function limpiarResultados() {
    $("#resultados").empty();
}

function mostrarResultados(resultados) {
    console.log(resultados);
    if (resultados.length === 0) {
        const mensajeSinResultados = $("<div/>", {
            class: "alert alert-info collapse",
            role: "alert",
            text: "No se encontraron resultados"
        });
        $("#resultados").append(mensajeSinResultados);
        mensajeSinResultados.collapse();
        return;
    }

    $("#resultados").append($("<div/>", {
        id: "mapa"
    }));

    // for (resultado of resultados) {
    //     const card = crearResultado(resultado);
    //     $("#resultados").append(card);
    //     card.collapse();
    // }
    // Where you want to render the map.
    var element = document.getElementById('mapa');

    // Create Leaflet map on map element.
    var map = L.map(element);

    // Add OSM tile leayer to the Leaflet map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Target's GPS coordinates.
    var target = L.latLng(resultados[0]["latitud"], resultados[0]["longitud"]);

    // Set map's center to target with zoom 14.
    map.setView(target, 14);

    // Place a marker on the same location.
    L.marker(target).addTo(map);
    for (let resultado of resultados) {
        const marcador = L.latLng(resultado["latitud"], resultado["longitud"]);
        L.marker(marcador).addTo(map);
    }
}

function mostrarErrores(errores) {
    Object.keys(errores).forEach(error => {
        const field = `#${error}`;
        const mensaje = errores[error];
        $(field).addClass("is-invalid")
            .after(mensajeDeError(mensaje));
    });
}

function buscarCajeros() {
    const data = {
        red: $("#red").val(),
        latitud: $("#latitud").val(),
        longitud: $("#longitud").val()
    };

    fetch("http://localhost:3000/cajeros?" + $.param(data))
        .then(respuesta => {
            const json = respuesta.json();
            if (!respuesta["ok"]) {
                return json.then(errores => mostrarErrores(errores));
            }
            return json.then(resultados => mostrarResultados(resultados));
        });
}

function obtenerGeolocation(event) {
    const text = $("#obtener-geolocation").html();
    $("#obtener-geolocation").html(`<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Obteniendo localización...`);
    navigator.geolocation.getCurrentPosition((posicion) => {
        console.log(posicion.coords.latitude);
        console.log(posicion.coords.longitude);
        $("#latitud").val(posicion.coords.latitude);
        $("#longitud").val(posicion.coords.longitude);
        $("#obtener-geolocation").html(text).blur();
    });
    event.preventDefault();
}

function submitHandler() {
    limpiarResultados();
    limpiarErrores();
    buscarCajeros();
}
