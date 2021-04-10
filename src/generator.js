var Generator = function() {

    generate_nif = () => {
        var r = Math.floor(1e8 * Math.random());
        return pad(r.toString(), 8) + calculateLetter(r)
    }
    
    generate_cif = () => {
        var r = 'ABCDEFGHJNPQRSUVW';
        r = r.charAt(Math.floor(17 * Math.random()));
        var t = Math.floor(100 * Math.random())
          , a = Math.floor(1e5 * Math.random())
          , n = r + pad(t.toString(), 2) + pad(a.toString(), 5);
        return n + calculateControlCIF(n);
    }
    
    generate_nie = () => {
        var r = Math.floor(3 * Math.random())
        , t = Math.floor(1e7 * Math.random())
        , a = calculateLetter(pad(parseInt(r.toString() + pad(t.toString(), 7), 10), 8));
        return 'XYZ'.charAt(r) + pad(t.toString(), 7) + a;
    }
    
    
    
    generate_email = () => {
        var allowedChars = 'abcdefghiklmnopqrstuvwxyz';
        var stringLength = 8;
        var randomstring = '';
     
        for (var i=0; i<stringLength; i++) {
            var rnum = Math.floor(Math.random() * allowedChars.length);
            randomstring += allowedChars.substring(rnum,rnum+1);
        }
     
        // Append a domain name
        randomstring += '@dominio.es';
        return randomstring;
    }

    calculateLetter = (v) => {
        return 'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(v % 23)
    }
    
    calculateControlCIF = (cif) => {
        var t = cif.substr(1, cif.length - 1)
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
          , s = cif.substr(0, 1).toUpperCase();
        return s.match(/^[PQRSNW]$/) ? String.fromCharCode(64 + o).toUpperCase() : s.match(/^[ABCDEFGHJUV]$/) ? (10 == o && (o = 0),
        o) : calculateLetter(cif)
    }
    
    pad = (t, e)  => {
        return (t = t.toString()).length < e ? pad('0' + t, e) : t
    }
}

Generator.prototype.generate = (field) => {
    let generateHandler = this[`generate_${field}`];
    return generateHandler();
}
