function Spinner() {
    const element = document.createElement("span");
    element.className = "spinner-border spinner-border-sm mr-2";
    element.setAttribute("role", "status");
    element.setAttribute("aria-hidden", "true");
    return element;
}

function ErrorMessage(message) {
    const element = document.createElement("small");
    element.className = "text-danger";
    element.textContent = message;
    return element;
}

function NoResultsMessage() {
    const element = document.createElement("div");
    element.className = "alert alert-info collapse";
    element.textContent = "No se encontraron resultados";
    element.setAttribute("role", "alert");
    return element;
}

function MapContainer() {
    const element = document.createElement("div");
    element.id = "map";
    return element;
}
