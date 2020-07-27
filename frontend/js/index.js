const reCaptchaKey = "6LeKN7YZAAAAANZxiEUV3KleUGELLQocOFRrHJIx";

function clearErrors() {
    for (const element of document.querySelectorAll(".is-invalid")) {
        element.classList.remove("is-invalid");
    }

    for (const element of document.querySelectorAll(".text-danger")) {
        element.remove();
    }
}

function clearResults() {
    document.getElementById("resultados").innerHTML = "";
}

function createMap(container, locations) {
    const map = L.map(container);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    for (const location of locations) {
        L.marker(L.latLng(location["latitud"], location["longitud"]), {
            title: `${location["banco"]}\n${location["direccion"]}`
        }).addTo(map);
    }

    map.setView(L.latLng(locations[0]["latitud"], locations[0]["longitud"]), 14);
}

function showMessage(parent, type, text) {
    const message = Message(type, text);
    parent.appendChild(message);
    $(message).collapse();
}

function showResults(results) {
    const resultsContainer = document.getElementById("resultados");

    if (results.length === 0) {
        showMessage(resultsContainer, "info", "No se encontraron resultados");
        return;
    }

    const map = MapContainer();
    resultsContainer.appendChild(map);

    createMap(map, results);
    scrollTo(0, map.offsetTop);
}

function showErrors(errors) {
    for (const key in errors) {
        if (key === "captcha") {
            showMessage(
                document.getElementById("resultados"),
                "danger",
                errors[key]
            );
        } else {
            const field = document.getElementById(key);
            field.classList.add("is-invalid");
            field.after(ErrorMessage(errors[key]));
        }
    }
}

function search(token) {
    const data = {
        red: document.getElementById("red").value,
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value,
        captcha: token
    };

    axios.get("http://localhost:3000/cajeros", {params: data})
        .then(response => showResults(response.data))
        .catch(error => showErrors(error.response.data));
}

function getGeolocation(event) {
    event.preventDefault();
    clearResults();
    const geoLocationButton = event.target;
    const buttonInnerHTML = geoLocationButton.innerHTML;

    geoLocationButton.textContent = "Obteniendo localización...";
    geoLocationButton.appendChild(Spinner());

    navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById("latitud").value = position.coords.latitude;
        document.getElementById("longitud").value = position.coords.longitude;        
        geoLocationButton.innerHTML = buttonInnerHTML;
        geoLocationButton.blur();
    }, () => {
        geoLocationButton.innerHTML = buttonInnerHTML;
        geoLocationButton.blur();
        showMessage(
            document.getElementById("resultados"),
            "danger",
            "No se pudo obtener la localización"
        );
    });
}

function onSubmit(event) {
    event.preventDefault();
    grecaptcha.ready(() => {
        grecaptcha.execute(
            reCaptchaKey,
            {action: 'submit'}
        ).then(token => {
            clearResults();
            clearErrors();
            search(token);
            event.target.blur();
        });
    });
}
