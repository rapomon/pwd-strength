const test = require('tape');
const passwordStrength = require('../src');

test('validate min password length', function(t) {
    const result = passwordStrength('Test', {
        minPasswordLength: 5
    });
    t.equal(result.success, false);
    t.end();
});

test('validate min lower chars', function(t) {
    const result = passwordStrength('TEST', {
        minLowerChars: 1
    });
    t.equal(result.success, false);
    t.end();
});

test('validate min upper chars', function(t) {
    const result = passwordStrength('test', {
        minUpperChars: 1
    });
    t.equal(result.success, false);
    t.end();
});

test('validate min special chars', function(t) {
    const result = passwordStrength('Test', {
        minSpecialChars: 1
    });
    t.equal(result.success, false);
    t.end();
});

test('validate max consecutive repeating chars', function(t) {
    const result = passwordStrength('Test', {
        maxConsecutiveRepeatingChars: 2
    });
    t.equal(result.success, false);
    t.end();
});
