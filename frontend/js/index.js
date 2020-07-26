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

function createMap(container, coordinates) {
    const map = L.map(container);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const locations = coordinates.map(x => L.latLng(x[0], x[1]));
    for (const location of locations) {
        L.marker(location).addTo(map);
    }
    map.setView(locations[0], 14);
};

function showResults(results) {
    const resultsContainer = document.getElementById("resultados");

    if (results.length === 0) {
        const message = NoResultsMessage();
        resultsContainer.appendChild(message);
        return $(message).collapse();
    }

    const map = MapContainer();
    resultsContainer.appendChild(map);

    const coordinates = results.map(r => [r["latitud"], r["longitud"]]);
    createMap(map, coordinates);
    scrollTo(0, map.offsetTop);
}

function showErrors(errors) {
    for (const key in errors) {
        const field = document.getElementById(key);
        field.classList.add("is-invalid");
        field.after(ErrorMessage(errors[key]));
    }
}

function search(token) {
    const data = {
        red: document.getElementById("red").value,
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value,
        captcha: token
    };

    fetch("http://localhost:3000/cajeros?" + $.param(data))
        .then(response => {
            const json = response.json();
            if (!response["ok"]) {
                return json.then(errors => showErrors(errors));
            }
            return json.then(results => showResults(results));
        });
}

function getGeolocation(event) {
    event.preventDefault();
    const geoLocationButton = event.target;
    const buttonInnerHTML = geoLocationButton.innerHTML;

    geoLocationButton.innerHTML = "";
    geoLocationButton.appendChild(Spinner());
    geoLocationButton.innerHTML += "Obteniendo localización...";

    navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById("latitud").value = position.coords.latitude;
        document.getElementById("longitud").value = position.coords.longitude;        
        geoLocationButton.innerHTML = buttonInnerHTML;
        geoLocationButton.blur();
    });
}

function onSubmit(event) {
    event.preventDefault();
    grecaptcha.ready(() => {
        grecaptcha.execute(
            '6LeKN7YZAAAAANZxiEUV3KleUGELLQocOFRrHJIx',
            {action: 'submit'}
        ).then(token => {
            clearResults();
            clearErrors();
            search(token);
            event.target.blur();
        });
    });
}
