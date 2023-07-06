const email = localStorage.getItem('jira-email') || sessionStorage.getItem('jira-email');
const token = localStorage.getItem('jira-token') || sessionStorage.getItem('jira-token');

if (!Boolean(email) && !Boolean(token)) {
    location.pathname = '/login.html';
}
/* LOCAL */
/* const JIRA_API_URL = 'http://localhost';
const JIRA_API_PORT = ':3010'; */
/* PRODUCCION */
const JIRA_API_URL = 'https://timeshit-backend-compass.onrender.com';
const JIRA_API_PORT = '';
let worklogsData = {};
let dates = [];

// Cerrar la cerrar sesión
document.querySelector('.logout-btn').addEventListener('click', cerrarSesion);

// Cerrar la tooltip al hacer clic en cualquier lugar fuera de la tooltip
document.querySelector('.profile-pic').addEventListener('click', function () {
    let tooltip = document.querySelector('.tooltip');
    if (tooltip.style.display === 'none' || tooltip.style.display === '') {
        tooltip.style.display = 'block';
    } else {
        tooltip.style.display = 'none';
    }
});

// Evitar que se cierre la tooltip al hacer clic dentro de la tooltip
document.querySelector('.tooltip').addEventListener('click', function (event) {
    event.stopPropagation();
});

document.querySelector('.tooltip .email').innerText = email;

const applyFiltersBtn = document.getElementById("apply-filters-btn");
applyFiltersBtn.addEventListener("click", applyFilters);

// Obtenemos los elementos input por su id
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

// Creamos un objeto de fecha para la fecha actual
const currentDate = new Date();
currentDate.setDate(currentDate.getDate());

// Establecemos el valor por defecto de la fecha de inicio del mes para el input de fecha de inicio
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
startDateInput.valueAsDate = firstDayOfMonth;

// Establecemos el valor de la fecha actual para el input de fecha de finalización
endDateInput.valueAsDate = currentDate;

function applyFilters() {
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;

    if (!Boolean(startDate) && !Boolean(endDate)) {
        alert('Debe ingresar el rango de fechas');
        return;
    }

    if (startDate > endDate) {
        let aux = startDate;
        startDate = endDate;
        endDate = aux;
    }

    getWorklogs(startDate, endDate);
}

function getDates(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate).toISOString().slice(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

function formatDate(dateString) {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const monthsOfYear = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const monthOfYear = monthsOfYear[date.getUTCMonth()];

    return `${dayOfWeek} ${dayOfMonth} de ${monthOfYear}`;
}

function cargarHS(event, started) {
    event.preventDefault();

    const { target } = event;
    const { value: key } = target.ticket;
    const { value: comment } = target.comment;
    const timeSpentSeconds = target.timeSpent.value * 60;
    const data = { key, comment, timeSpentSeconds, started };

    showLoader();
    fetch(`${JIRA_API_URL}${JIRA_API_PORT}/worklog`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            email,
            token
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.created) {
                alert('Hora cargada, fecha de creacion: ' + data.created);
                modalClose();
                applyFilters();
            } else {
                alert('error cargando hora');
            }
        })
        .catch(error => {
            alert('error al intentar agregar registro de hora, si el error persiste cambia el token o contacta a tu memero de confianza');
            console.log(error);
            hideLoader();
        });
}

function editarHS(event, dataJSON) {
    event.preventDefault();

    const { value: comment } = event.target.comment;
    const { value: key } = event.target.ticket;
    const timeSpentSeconds = event.target.timeSpent.value * 60;
    const { started, id } = dataJSON;

    const data = { id, key, comment, timeSpentSeconds, started };

    showLoader();
    fetch(`${JIRA_API_URL}${JIRA_API_PORT}/worklog`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            email,
            token
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.updated) {
                alert('Hora actualizada, fecha de actualizacion: ' + data.updated);
                modalClose();
                applyFilters();
            } else {
                alert('error cargando hora');
            }
        })
        .catch(error => {
            alert('error al intentar editar registro de hora, si el error persiste cambia el token o contacta a tu memero de confianza');
            console.log(error);
            hideLoader();
        })
}

function eliminarHS(data) {
    showLoader();
    fetch(`${JIRA_API_URL}${JIRA_API_PORT}/worklog`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            email,
            token
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            alert('registro borrado');
            applyFilters();
        })
        .catch(error => {
            alert('error al intentar borrar registro, si el error persiste cambia el token o contacta a tu memero de confianza');
            console.log(error);
            hideLoader();
        })
        .finally(() => {
            cerrarAlerta();
        });
}

function getWorklogs(startDate, endDate) {
    const headers = {
        email,
        token
    };

    showLoader();
    fetch(`${JIRA_API_URL}${JIRA_API_PORT}/worklog/${startDate}/${endDate}`, { headers })
        .then(response => response.json())
        .then(data => {
            worklogsData = data.worklogs;
            renderWorklogs(startDate, endDate);
        })
        .catch(error => {
            console.log(error);
            alert('Error al mostrar las horas cargadas, si el error persiste cambia el token, fijate que esté correcto el email o contacta a tu memero de confianza');
        })
        .finally(() => {
            hideLoader()
        })
}

function renderWorklogs(startDate, endDate) {
    let calendarColumnsHTML = '';
    dates = getDates(startDate, endDate);

    worklogsData = dates.map(dt => {
        return {
            [dt]: Boolean(worklogsData[dt]) ? (worklogsData[dt][email] ?? []) : []
        };
    });

    calendarColumnsHTML = worklogsData.map(wl => {
        let dt = Object.keys(wl)[0];
        let wlList = wl[dt];
        let auxHTML = `
        <div class="calendar-column">
            <div class="calendar-column-header">
                <span class="date">${formatDate(dt)}</span>
                <span class="hours">${wlList[wlList.length - 1]?.totalTimeSpentFormatted ?? '0H'}</span>
                <button class="btn-add-worklog" onclick="openModalAddWorklog('${dt}')">Cargar HS</button>
            </div>
            <div class="calendar-column-body">
        `;
        auxHTML += wlList.map(card => {
            //const {description: {key, title, description: resume, parentKey}, timeSpent, comment, id} = card;

            if (!Boolean(card.description)) {
                return '';
            }

            const { key, title, description: resume, parentKey } = card.description;
            const { timeSpent, comment, id } = card;

            let auxCardHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">
                        ${parentKey ? parentKey + '-' : ''}${key}-${title}
                        <span class="hours">${timeSpent}</span>
                    </h2>
                    <p class="card-description">${resume}</p>
                    <p class="card-worklog">Comentario: ${comment}</p>
                </div>
                <div class="card-footer">
                    <button class="btn-edit-worklog" onclick="openModalEditWorklog('${id}')">Editar</button>
                    <button class="btn-delete-worklog" onclick='mostrarAlerta(${JSON.stringify({ key, id })})'>Borrar</button>
                </div>
            </div>`;
            return auxCardHTML;
        }).join('');

        auxHTML += `
            </div>
        </div>
        `;

        return auxHTML;
    }).join('');

    document.querySelector('.calendar-container').innerHTML = calendarColumnsHTML;
}

function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();

    location.pathname = '/login.html';
}