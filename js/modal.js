
// Obtener el modal
let modal = document.getElementById("modal");
let modalContent = document.querySelector(".modal-content");

// Cuando el usuario haga clic fuera del modal, cerrarlo
window.onclick = function (event) {
    if (event.target == modal) {
        modalClose(); // Simular un clic en el botón de cerrar
    }
}

function modalClose() {
    modal.style.animationName = "modal-exit"; // Aplicar animación de salida
    modal.style.animationDuration = "0.5s";
    setTimeout(function () {
        modal.style.display = "none";
        modal.style.animationName = "modal-enter"; // Reiniciar animación de entrada
        modal.style.animationDuration = "0.5s";
        modalContent.innerHTML = '';
    }, 500); // Esperar a que termine la animación de salida antes de ocultar el modal
}

function convertDateToISOString(dt) {
    const fechaHora = new Date(dt);

    // Función para agregar un cero a la izquierda si el número es menor a 10
    function agregarCeroIzq(numero) {
        return numero < 10 ? '0' + numero : numero;
    }
    // Función para agregar ceros a la izquierda para completar tres dígitos
    function agregarCerosMilisegundos(numero) {
        return numero < 100 ? (numero < 10 ? '00' : '0') + numero : numero;
    }

    // Formatear la fecha y hora en el formato requerido
    return `${fechaHora.getFullYear()}-${agregarCeroIzq(fechaHora.getMonth() + 1)}-${agregarCeroIzq(fechaHora.getDate())}T${agregarCeroIzq(fechaHora.getHours())}:${agregarCeroIzq(fechaHora.getMinutes())}:${agregarCeroIzq(fechaHora.getSeconds())}.${agregarCerosMilisegundos(fechaHora.getMilliseconds())}+0300`;
}

function openModalAddWorklog(dt) {
    const date = new Date(dt + 'T12:00');
    const dateFormatted = convertDateToISOString(date);

    let html = `
    <span class="close" onclick="modalClose();">&times;</span>
    <div>
        <h2>Agregar horas</h2>
        <form onsubmit="cargarHS(event, '${dateFormatted}')">
            <div class="form-group">
                <label for="ticket">Ticket (solo el numero, ejemplo 8115):</label>
                <input type="text" id="ticket" name="ticket" autocomplete="off" required>
            </div>
            <div class="form-group timespent">
                <label>
                    Tiempo invertido en la tarea (se cambió "gastado" por "invertido" porque ambos sabemos que no gastaste tiempo)
                </label>
                <div class="timespent">
                    <div>
                        <label>Horas: </label>
                        <input type="number" id="timeSpentHours" name="timeSpentHours" min="0" value="0" required>
                    </div>
                    <div>
                        <label>Minutos: </label>
                        <input type="number" id="timeSpentMinutes" name="timeSpentMinutes" min="1" value="0" required>
                    </div>
                </div>
            </div>
            <div class="form-group comment">
                <label for="comment">Descripcion de lo realizado:</label>
                <textarea id="comment" name="comment" required></textarea>
            </div>
            <button type="submit">Guardar</button>
        </form>
    </div>
    `;

    modalContent.innerHTML = html;
    modal.style.display = "flex";
}

function openModalEditWorklog(id) {
    let dtArr = worklogsData.find(wl => {
        let dt = Object.keys(wl)[0];
        return wl[dt].find(task => task.id === id)
    })
    dtArr = Object.values(dtArr)[0].find(wl => wl.id === id);

    let hours = Math.floor(dtArr.timeSpentSeconds / 3600);
    let minutes = Math.floor((dtArr.timeSpentSeconds % 3600) / 60);

    let html = `
    <span class="close" onclick="modalClose();">&times;</span>
    <div>
        <h2>Editar hora cargada</h2>
        <form onsubmit='editarHS(event, ${JSON.stringify(dtArr)})'>
            <div class="form-group">
                <label for="ticket">Ticket:</label>
                <input type="text" id="ticket" name="ticket" autocomplete="off" value="${dtArr.description.key.substr(3, 4)}" disabled required>
            </div>
            <div class="form-group timespent">
                <label>
                    Tiempo invertido en la tarea (se cambió "gastado" por "invertido" porque ambos sabemos que no gastaste tiempo)
                </label>
                <div class="timespent">
                    <div>
                        <label>Horas: </label>
                        <input type="number" id="timeSpentHours" name="timeSpentHours" min="0" value="${hours}" required>
                    </div>
                    <div>
                        <label>Minutos: </label>
                        <input type="number" id="timeSpentMinutes" name="timeSpentMinutes" min="1" value="${minutes}" required>
                    </div>
                </div>
            </div>
            <div class="form-group comment">
                <label for="comment">Descripcion de lo realizado:</label>
                <textarea id="comment" name="comment" required>${dtArr.comment}</textarea>
            </div>
            <button type="submit">Guardar</button>
        </form>
    </div>
    `;

    modalContent.innerHTML = html;
    modal.style.display = "flex";
}

function openModalMeme() {
    let timestamp = (new Date()).getTime();
    let html = `
    <span class="close" onclick="modalClose();">&times;</span>
    <div>
        <h2>Meme del mes</h2>
        <div class="modal-meme">
            <img src="/assets/img/meme.png?timestamp=${timestamp}" alt="meme del mes" />
        </div>
    </div>
    `;

    modalContent.innerHTML = html;
    modal.style.display = "flex";
}