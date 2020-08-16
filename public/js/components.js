function Spinner() {
    const element = document.createElement("span");
    element.className = "spinner-border spinner-border-sm ml-2";
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

function Message(type, message) {
    const element = document.createElement("div");
    element.className = `alert alert-${type} collapse`;
    element.textContent = message;
    element.setAttribute("role", "alert");
    return element;
}

function MapContainer() {
    const element = document.createElement("div");
    element.id = "map";
    return element;
}
