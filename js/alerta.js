function mostrarAlerta(data) {
    document.getElementById("alerta").style.display = "flex";
    document.querySelector(".alerta .contenido .botones .si").onclick = () => si(data);
}

function si({key, id}) {
    // Ejecutar función aquí
    key = key.substr(3, 4);
    eliminarHS({key, id});
}

function no() {
    cerrarAlerta();
}

function cerrarAlerta() {
    var alerta = document.getElementById("alerta");
    alerta.style.animation = "alertaSalida 0.5s forwards";
    setTimeout(function () {
        alerta.style.display = "none";
        alerta.style.animation = "";
    }, 500);
}  