let values = ['nif', 'cif', 'nie', 'email'];

/// HANDLERS ///

function refreshAll() {
    values.forEach(v => {
        refresh(v);
    });
    
}

function refresh(field) {
    let fieldWrapper = document.getElementById(field);
    fieldWrapper.querySelector('input').value = generate(field);
}

function generate(field) {
    let generateHandler = this[`generate_${field}`];
    return generateHandler();
}

function copy(field) {
    let fieldWrapper = document.getElementById(field);
    navigator.clipboard.writeText(fieldWrapper.querySelector('input').value).then(() => {
        console.log("copied!");
    }, () => {
        console.log("copy error :(");
    });
}


/// LIB ///

function generate_nif() {
    var r = Math.floor(1e8 * Math.random());
    return pad(r.toString(), 8) + calculateLetter(r)
}

function generate_cif() {
    var r = 'ABCDEFGHJNPQRSUVW';
    r = r.charAt(Math.floor(17 * Math.random()));
    var t = Math.floor(100 * Math.random())
      , a = Math.floor(1e5 * Math.random())
      , n = r + pad(t.toString(), 2) + pad(a.toString(), 5);
    return n + calculateControlCIF(n);
}

function generate_nie() {
    var r = Math.floor(3 * Math.random())
    , t = Math.floor(1e7 * Math.random())
    , a = calculateLetter(pad(parseInt(r.toString() + pad(t.toString(), 7), 10), 8));
    return 'XYZ'.charAt(r) + pad(t.toString(), 7) + a;
}

function calculateLetter(r) {
    return 'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(r % 23)
}

function calculateControlCIF(r) {
    var t = r.substr(1, r.length - 1)
      , a = 0
      , n = 0;
    for (n = 1; n < t.length; n += 2)
        a += parseInt(t.substr(n, 1));
    var e = 0;
    for (n = 0; n < t.length; n += 2) {
        var l = 2 * parseInt(t.substr(n, 1));
        1 == String(l).length ? e += parseInt(l) : e = e + parseInt(String(l).substr(0, 1)) + parseInt(String(l).substr(1, 1))
    }
    var o = 10 - (a += e) % 10
      , s = r.substr(0, 1).toUpperCase();
    return s.match(/^[PQRSNW]$/) ? String.fromCharCode(64 + o).toUpperCase() : s.match(/^[ABCDEFGHJUV]$/) ? (10 == o && (o = 0),
    o) : calculateLetter(r)
}

function pad (t, e) {
    return (t = t.toString()).length < e ? pad('0' + t, e) : t
}

function generate_email() {
    var allowedChars = 'abcdefghiklmnopqrstuvwxyz';
    var stringLength = 8;
    var randomstring = '';
 
    for (var i=0; i<stringLength; i++) {
        var rnum = Math.floor(Math.random() * allowedChars.length);
        randomstring += allowedChars.substring(rnum,rnum+1);
    }
 
    // Append a domain name
    randomstring += '@domainname.com';
    return randomstring;
}

 
/// ON LOAD ///

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
        this.refresh(field);
    })
}

let copyButtons = document.querySelectorAll('[data-action="copy"]');
for (const copyButton of copyButtons) {
    copyButton.addEventListener('click', async(e) => {
        let field = e.target.dataset?.field ?? e.target.parentElement.dataset.field;
        this.copy(field);
    })
}

refreshAll();