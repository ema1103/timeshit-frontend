const myTemplates = document.getElementById('plantillas');
const myTemplatesBody = document.querySelector('#plantillas .plantillas__body');
var listener;

function seeMyTemplates() {
    renderAllTemplates();

    myTemplates.classList.add('plantillas--active');

    listener = function(event) {
        // Comprueba si el clic ocurrió dentro del div o en alguno de sus hijos
        if (!myTemplates.contains(event.target) && myTemplates.classList.contains('plantillas--active')) {
        // El clic ocurrió fuera del div
        myTemplates.classList.remove('plantillas--active');
        }
    };

    document.addEventListener('mousedown', listener);
}

function closeMyTemplates() {
    myTemplates.classList.remove('plantillas--active');

    document.removeEventListener('mousedown', listener);
}

function renderAllTemplates() {
    let LSTemplateList = localStorage.getItem('templateList');
    let templateList = Boolean(LSTemplateList) ? JSON.parse(LSTemplateList) : [];
    let searcher = document.getElementById('plantillas-search');

    templateList = templateList.filter(({ key, timeSpentHours, timeSpentMinutes, comment }) => {
        return  `${key}`.includes(searcher.value) ||
                `${timeSpentHours}`.includes(searcher.value) ||
                `${timeSpentMinutes}`.includes(searcher.value) ||
                `${comment}`.includes(searcher.value);
    });
    
    let cardsHTML = templateList.map((template, index) => {
        return `
        <div class="plantilla-card" onclick="applyTemplate(${index})">
            <span class="close" onclick="deleteTemplate(event, ${index})">×</span>
            <p>CG-${template.key} <span class="hours">${template.timeSpentHours}H ${template.timeSpentMinutes}M</span></p>
            <p>Comentario: ${template.comment}</p>
        </div>
        `;
    }).join('');
    
    myTemplatesBody.innerHTML = cardsHTML;
}

function createTemplate(data) {
    let LSTemplateList = localStorage.getItem('templateList');
    let templateList = Boolean(LSTemplateList) ? JSON.parse(LSTemplateList) : [];
    
    templateList.push(data);
    
    localStorage.setItem('templateList', JSON.stringify(templateList));
    
    renderAllTemplates();

    alert('Plantilla Creada!')
}

function deleteTemplate(event, index) {
    event.preventDefault();
    event.stopPropagation();

    let templateList = JSON.parse(localStorage.getItem('templateList'));
    
    templateList.splice(index, 1);
    
    localStorage.setItem('templateList', JSON.stringify(templateList));
    
    renderAllTemplates();

    alert('Plantilla Eliminada, Asesinada, Acribillada... bueno se entendió!')
}

function applyTemplate(index) {
    let templateList = JSON.parse(localStorage.getItem('templateList'));
    let templateItem = templateList[index];
    let inputs = {
        key: document.getElementById('ticket'),
        timeSpentHours: document.getElementById('timeSpentHours'),
        timeSpentMinutes: document.getElementById('timeSpentMinutes'),
        comment: document.getElementById('comment'),
    };

    for (let id in inputs) {
        inputs[id].value = templateItem[id];
    }
}