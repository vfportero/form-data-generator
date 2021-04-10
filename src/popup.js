let values = ['nif', 'cif', 'nie', 'email', 'cups'];
let generator = new Generator();


 
/// ON LOAD ///

document.addEventListener("DOMContentLoaded", function(event) { 
    let valuesWrapper = document.getElementById('values');
    values.forEach(v => {
        let valueItem = document.createElement('div');
        valueItem.classList.add('item');
        valueItem.id = v;

        valueItem.innerHTML = `
        <div class="name">${v.toUpperCase()}</div>
        <div class="value">
            <input disabled>
            <button class="addon" data-action="copy" data-field="${v}"><img src="images/copy.png"></button>
            <button class="addon" data-action="refresh" data-field="${v}"><img src="images/refresh.png"></button>
        </div>
        `
        valuesWrapper.appendChild(valueItem);
    });

    let refreshButtons = document.querySelectorAll('[data-action="refresh"]');
    for (const refreshButton of refreshButtons) {
        refreshButton.addEventListener('click', async(e) => {
            let field = e.target.dataset?.field ?? e.target.parentElement.dataset.field;
            refresh(field);
        })
    }

    let copyButtons = document.querySelectorAll('[data-action="copy"]');
    for (const copyButton of copyButtons) {
        copyButton.addEventListener('click', async(e) => {
            let field = e.target.dataset?.field ?? e.target.parentElement.dataset.field;
            copy(field);
        })
    }

    refreshAll();
});


/// HANDLERS ///

function refreshAll() {
    values.forEach(v => {
        refresh(v);
    });
    
}

function refresh(field) {
    let fieldWrapper = document.getElementById(field);
    fieldWrapper.querySelector('input').value = generator.generate(field);
}


function copy(field) {
    let fieldWrapper = document.getElementById(field);
    navigator.clipboard.writeText(fieldWrapper.querySelector('input').value).then(() => {
        console.log("copied!");
    }, () => {
        console.log("copy error :(");
    });
}
