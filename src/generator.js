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
    
    const EMAIL_ALLOWED_CHARS = 'abcdefghiklmnopqrstuvwxyz';
    generate_email = () => {
        
        var stringLength = 8;
        var randomstring = '';
     
        for (var i=0; i<stringLength; i++) {
            var rnum = Math.floor(Math.random() * EMAIL_ALLOWED_CHARS.length);
            randomstring += EMAIL_ALLOWED_CHARS.substring(rnum,rnum+1);
        }
     
        // Append a domain name
        randomstring += '@dominio.es';
        return randomstring;
    }

    const BANK_CODES = ['2038','0128','1467','2100','2095','0073','2103','0081','3081','0019','0239','0238'];

    generate_iban = () => {
        let countryCode = 'ES';
        let bankCode = BANK_CODES[randomNumer(BANK_CODES.length-1)];
        let branchCode = pad(randomNumer(9999),4);
        let accountNumber = pad(randomNumer(9999999999), 10);

        let accountCheckDigits = calculateBankAccountCheckDigit(bankCode, branchCode, accountNumber);
        
        let accountBankNumber = bankCode.toString() + branchCode.toString() + accountCheckDigits.toString() + accountNumber.toString();
        let ibanCheckDigits = calculateIbanCheckDigit(countryCode, accountBankNumber);
        return countryCode + ibanCheckDigits.toString() + accountBankNumber;
    }

    calculateBankAccountCheckDigit = ( bankCode, branchCode, accountNumber ) => {

        let first  = 0,
            second = 0,
            calc   = 0;
    
        let multi = new Array( 1, 2, 4, 8, 5, 10, 9, 7, 3, 6 );
    
        bankCode.split('').forEach((v,i) => {
            calc += ( parseInt(v) * multi[i + 2] );
        });
        branchCode.split('').forEach((v,i) => {
            calc += ( parseInt(v) * multi[i + 6] );
        });
    
        calc = 11 - ( calc % 11 );
    
        switch (calc) {
            case 10:
                first = 1;
                break;
            case 11:
                first = 0;
                break;
            default:
                first = calc;
                break;
        }
    
        calc = 0;
    
        accountNumber.split('').forEach((v,i) => {
            calc += ( parseInt(v) * multi[i] );
        });
        
    
        calc = 11 - ( calc % 11 );
    
        switch (calc) {
            case 10:
                second = 1;
                break;
            case 11:
                second = 0;
                break;
            default:
                second = calc;
                break;
        }
    
        return first.toString() + second.toString();
    }

    calculateIbanCheckDigit = (countryCode, accountBankNumber  ) => {
        
        let ccc = accountBankNumber;
        countryCode.split('').forEach((v,i) => {
            ccc += (v.charCodeAt(0)-55);
        });

        ccc+='00';

        let checkDigit = pad(98 - module(ccc, 97), 2);
        return checkDigit;
    }

    module = ( divident, divisor ) => {
        var partLength = 10;
    
        while (divident.length > partLength) {
            var part = divident.substring(0, partLength);
            divident = (part % divisor) +  divident.substring(partLength);          
        }
    
        return divident % divisor;
    }


    const CUPS_CHECKSUM_CHARS = [ 'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E' ];

    generate_cups = (distributionCompanyCode = 21, internalCode = 0) => {
        distributionCompanyCode = pad(distributionCompanyCode > 0 ? distributionCompanyCode : randomNumer(99), 4);
        internalCode = pad(internalCode > 0 ? internalCode : randomNumer(999999999999), 12);

        var checkSum = getCupsComputedChecksum(distributionCompanyCode, internalCode);
        return `ES${distributionCompanyCode}${internalCode}${checkSum}`;
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
    
    pad = (value, length)  => {
        return (value = value.toString()).length < length ? pad('0' + value, length) : value
    }

    randomNumer = (max) => {
        return Math.floor(Math.random() * max);
    }

    getCupsComputedChecksum = (distributionCompanyCode, internalCode) => {
        
        let code = distributionCompanyCode + internalCode;
        let codeNumber = parseInt(code);
        var module529 = codeNumber % 529;
        var c = parseInt(module529 / 23);
        var r = parseInt(module529 % 23);

        return `${CUPS_CHECKSUM_CHARS[c]}${CUPS_CHECKSUM_CHARS[r]}`;
    }
}

Generator.prototype.generate = (field) => {
    let generateHandler = this[`generate_${field}`];
    return generateHandler();
}
