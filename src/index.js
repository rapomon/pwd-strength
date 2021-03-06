module.exports = function passwordStrength(value, options) {

    let defaults = {
        debug: false, // Debug mode
        allErrors: false, // Return all errors instead the first error found
        minUpperChars: 1, // Upper characters ([A-Z])
        minLowerChars: 1, // Lower characters ([a-z])
        minNumberChars: 1, // Numbers ([0-9])
        minSpecialChars: 1, // Symbols (any character not in [a-zA-Z0-9])
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
            minNumberChar: "At least %s number please",
            minNumberChars: "At least %s numbers please",
            minSpecialChar: "At least %s special character please",
            minSpecialChars: "At least %s special characters please",
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

            // Counting chars
            if (currentChar.match(/[A-Z]/g)) {
                num.upper++;
            } else if (currentChar.match(/[a-z]/g)) {
                num.lower++;
            } else if (currentChar.match(/[0-9]/g)) {
                num.numbers++;
            } else {
                num.symbols++;
            }

            // Repeating chars
            if (previousChar !== null && num.repeatingChars <= settings.maxConsecutiveRepeatingChars) {
                if (charPassword[i] === previousChar) {
                    if (num.repeatingChars === 0) num.repeatingChars = 1;
                    num.repeatingChars++;
                } else {
                    num.repeatingChars = 0;
                }
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

    function format(msg, variable) {
        if (typeof(msg) === 'string') {
            return msg.replace('%s', variable);
        } else {
            return '';
        }
    }

    function calcComplexity() {
        score = baseScore +
                (num.excess * settings.excess) +
                (num.upper * settings.minUpperChars) +
                (num.lower * settings.minLowerChars) +
                (num.numbers * settings.minNumberChars) +
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
            message: [],
            color: ''
        };

        if (strPassword === '') {
            let message = lang.enterPassword;
            result.message.push(message);
            result.color = colors.error;
        }
        if (charPassword.length < settings.minPasswordLength) {
            let message = settings.minPasswordLength !== 1 ? lang.minPasswordChars : lang.minPasswordChar;
            result.message.push(format(message, settings.minPasswordLength));
            result.color = colors.error;
        }
        if (num.lower < settings.minLowerChars) {
            let message = settings.minLowerChars !== 1 ? lang.minLowerChars : lang.minLowerChar;
            result.message.push(format(message, settings.minLowerChars));
            result.color = colors.error;
        }
        if (num.upper < settings.minUpperChars) {
            let message = settings.minUpperChars !== 1 ? lang.minUpperChars : lang.minUpperChar;
            result.message.push(format(message, settings.minUpperChars));
            result.color = colors.error;
        }
        if (num.numbers < settings.minNumberChars) {
            let message = settings.minNumberChars !== 1 ? lang.minNumberChars : lang.minNumberChar;
            result.message.push(format(message, settings.minNumberChars));
            result.color = colors.error;
        }
        if (num.symbols < settings.minSpecialChars) {
            let message = settings.minSpecialChars !== 1 ? lang.minSpecialChars : lang.minSpecialChar;
            result.message.push(format(message, settings.minSpecialChars));
            result.color = colors.error;
        }
        if (settings.maxConsecutiveRepeatingChars > 1 && num.repeatingChars > settings.maxConsecutiveRepeatingChars) {
            let message = lang.maxConsecutiveRepeatingChars;
            result.message.push(format(message, settings.maxConsecutiveRepeatingChars));
            result.color = colors.error;
        }
        
        if (result.message.length === 0) {
            if (score < 50) {
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
        }

        if (settings.debug) {
            
            result.debug = 'Base score: ' + baseScore  + '\n'
                         + 'Length bonus: ' + (num.excess*settings.excess) + ' ['+num.excess+'x'+settings.excess+']\n'
                         + 'Upper case bonus: ' + (num.upper*settings.minUpperChars) + ' ['+num.upper+'x'+settings.minUpperChars+']\n'
                         + 'Lower case bonus: ' + (num.lower*settings.minLowerChars) + ' ['+num.lower+'x'+settings.minLowerChars+']\n'
                         + 'Number bonus: ' + (num.numbers*settings.minNumberChars) + ' ['+num.numbers+'x'+settings.minNumberChars+']\n'
                         + 'Symbol bonus: ' + (num.symbols*settings.minSpecialChars) + ' ['+num.symbols+'x'+settings.minSpecialChars+']\n'
                         + 'Combination bonus: ' + settings.combo + '\n'
                         + 'Lower case only penalty: ' + settings.flatLower + '\n'
                         + 'Numbers only penalty: ' + settings.flatNumber + '\n'
                         + 'Total score: ' + score;

            console.log(result.debug);
        }

        if (!result.success && !settings.allErrors) {
            result.message = result.message.length > 0 ? result.message[0] : '';
        }

        return result;
    }

    init();

    if (charPassword.length >= settings.minPasswordLength) {
        baseScore = 50;
    } else {
        baseScore = 0;
    }

    analyzeString();
    calcComplexity();

    return outputResult();

};
