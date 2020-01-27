const util = require('util');

module.exports = function passwordStrength(value, options) {

    let defaults = {
        debug: false,
        minUpperChars: 1, // Upper characters ([A-Z])
        minLowerChars: 1, // Lower characters ([a-z])
        minSpecialChars: 1, // Numbers and symbols (any character not in [a-zA-Z])
        minPasswordLength: 8, // Minimum password length
        maxConsecutiveRepeatingChars: 2, // Maximum consecutive repeating characters
        excess: 3,
        combo: 0,
        flatLower: 0,
        flatNumber: 0,
        lang: {
            weak: "Weak",
            average: "Average",
            strong: "Strong",
            secure: "Secure",
            enterPassword: "Enter a password",
            minPasswordChar: "At least %s character please",
            minPasswordChars: "At least %s characters please",
            minLowerChar: "At least %s lowercase character please",
            minLowerChars: "At least %s lowercase characters please",
            minUpperChar: "At least %s uppercase character please",
            minUpperChars: "At least %s uppercase characters please",
            minSpecialChar: "At least %s number or special character please",
            minSpecialChars: "At least %s numbers or special characters please",
            maxConsecutiveRepeatingChars: "No more than %s consecutive repeating characters or numbers please"
        },
        colors: {
            error: "#ee0000",
            weak: "#c43d4b",
            average: "#cc9900",
            strong: "#569f0c",
            secure: "#007000"
        }
    };

    let settings = options ? { ...defaults, ...options } : defaults;

    let strPassword;
    let charPassword;
    let baseScore = 0;
    let score = 0;
    let num = {};
    num.excess = 0;
    num.upper = 0;
    num.lower = 0;
    num.numbers = 0;
    num.symbols = 0;
    num.repeatingChars = 0;

    function init() {
        strPassword = value;
        charPassword = strPassword.split('');

        num.excess = 0;
        num.upper = 0;
        num.lower = 0;
        num.numbers = 0;
        num.symbols = 0;
        num.repeatingChars = 0;
        settings.combo = 0;
        settings.flatLower = 0;
        settings.flatNumber = 0;
        baseScore = 0;
        score = 0;
    }

    function analyzeString() {	
        let previousChar = null;
        for (let i=0; i < charPassword.length; i++) {
            let currentChar = charPassword[i];

            if (currentChar.match(/[A-Z]/g)) {
                num.upper++;
            } else if (currentChar.match(/[a-z]/g)) {
                num.lower++;
            } else if (currentChar.match(/[0-9]/g)) {
                num.numbers++;
            } else {
                num.symbols++;
            }

            if(previousChar !== null && num.repeatingChars <= settings.maxConsecutiveRepeatingChars && charPassword[i] === previousChar) {
                if(num.repeatingChars === 0) num.repeatingChars = 1;
                num.repeatingChars++;
            }
            if(num.repeatingChars > settings.maxConsecutiveRepeatingChars) {
                continue;
            }
            if(previousChar !== null && charPassword[i] !== previousChar) {
                num.repeatingChars = 0;
            }
            previousChar = charPassword[i];
        }

        num.excess = charPassword.length - settings.minPasswordLength;

        if (num.upper && num.lower && num.numbers && num.symbols) {
            settings.combo = 25;
        }

        else if ((num.upper && num.numbers) ||
                (num.upper && num.symbols) ||
                (num.lower && num.numbers) ||
                (num.lower && num.symbols) ||
                (num.numbers && num.symbols)) {
            settings.combo = 15;
        }

        if (strPassword.match(/^[\sa-z]+$/)) {
            settings.flatLower = -15;
        }

        if (strPassword.match(/^[\s0-9]+$/)) {
            settings.flatNumber = -35;
        }
    }

    function calcComplexity() {
        score = baseScore +
                (num.excess * settings.excess) +
                (num.upper * settings.minUpperChars) +
                (num.lower * settings.minLowerChars) +
                (num.numbers * settings.minSpecialChars) +
                (num.symbols * settings.minSpecialChars) +
                settings.combo +
                settings.flatLower +
                settings.flatNumber;
    }

    function outputResult() {

        let lang = settings.lang;
        let colors = settings.colors;
        let result = {
            success: false,
            key: 'error',
            message: '',
            color: ''
        };

        if (value === '') {
            result.message = settings.enterPassword;
            result.color = colors.error;
        } else if (charPassword.length < settings.minPasswordLength) {
            result.message = settings.minPasswordLength !== 1 ? lang.minPasswordChars : lang.minPasswordChar;
            result.message = util.format(result.message, settings.minPasswordLength);
            result.color = colors.error;
        } else if (num.lower < settings.minLowerChars) {
            result.message = settings.minLowerChars !== 1 ? lang.minLowerChars : lang.minLowerChar;
            result.message = util.format(result.message, settings.minLowerChars);
            result.color = colors.error;
        } else if (num.upper < settings.minUpperChars) {
            result.message = settings.minUpperChars !== 1 ? lang.minUpperChars : lang.minUpperChar;
            result.message = util.format(result.message, settings.minUpperChars);
            result.color = colors.error;
        } else if (num.symbols + num.numbers < settings.minSpecialChars) {
            result.message = settings.minSpecialChars !== 1 ? lang.minSpecialChars : lang.minSpecialChar;
            result.message = util.format(result.message, settings.minSpecialChars);
            result.color = colors.error;
        } else if (settings.maxConsecutiveRepeatingChars > 1 && num.repeatingChars > settings.maxConsecutiveRepeatingChars) {
            result.message = lang.maxConsecutiveRepeatingChars;
            result.message = util.format(result.message, settings.maxConsecutiveRepeatingChars);
            result.color = colors.error;
        } else if (score < 50) {
            result.success = true;
            result.key = 'weak';
            result.message = lang.weak;
            result.color = colors.weak;
        } else if (score >= 50 && score < 75) {
            result.success = true;
            result.key = 'average';
            result.message = lang.average;
            result.color = colors.average;
        } else if (score >= 75 && score < 100) {
            result.success = true;
            result.key = 'strong';
            result.message = lang.strong;
            result.color = colors.strong;
        } else if (score >= 100) {
            result.success = true;
            result.key = 'secure';
            result.message = lang.secure;
            result.color = colors.secure;
        }

        if(settings.debug) {
            
            result.debug = 'Base score:' + baseScore  + '\n'
                         + 'Length bonus: ' + (num.excess*settings.excess) + ' ['+num.excess+'x'+settings.excess+']\n'
                         + 'Upper case bonus: ' + (num.upper*settings.minUpperChars) + ' ['+num.upper+'x'+settings.minUpperChars+']\n'
                         + 'Lower case bonus: ' + (num.lower*settings.minLowerChars) + ' ['+num.lower+'x'+settings.minLowerChars+']\n'
                         + 'Number bonus: ' + (num.numbers*settings.minSpecialChars) + ' ['+num.numbers+'x'+settings.minSpecialChars+']\n'
                         + 'Symbol bonus: ' + (num.symbols*settings.minSpecialChars) + ' ['+num.symbols+'x'+settings.minSpecialChars+']\n'
                         + 'Combination bonus: ' + settings.combo + '\n'
                         + 'Lower case only penalty: ' + settings.flatLower + '\n'
                         + 'Numbers only penalty: ' + settings.flatNumber + '\n'
                         + 'Total score: ' + score;

            console.log(result.debug);
        }

        return result;

    }

    init();

    if (charPassword.length >= settings.minPasswordLength) {
        baseScore = 50;
        analyzeString();
        calcComplexity();
    } else {
        baseScore = 0;
    }

    return outputResult();

};
