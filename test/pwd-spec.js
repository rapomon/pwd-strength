const test = require('tape');
const passwordStrength = require('../src');

test('validate min password length', function(t) {
    const result = passwordStrength('Test', {
        minPasswordLength: 5
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.end();
});

test('validate min lower chars', function(t) {
    const result = passwordStrength('TEST', {
        minLowerChars: 1
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.end();
});

test('validate min upper chars', function(t) {
    const result = passwordStrength('test', {
        minUpperChars: 1
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.end();
});

test('validate min numbers', function(t) {
    const result = passwordStrength('Test', {
        minNumberChars: 1
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.end();
});
test('validate min special chars', function(t) {
    const result = passwordStrength('Test1', {
        minSpecialChars: 1
    });
    t.equal(result.success, false);
    t.end();
});

test('validate max consecutive repeating chars', function(t) {
    const result = passwordStrength('Test', {
        maxConsecutiveRepeatingChars: 2
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.end();
});

test('validate all errors with empty password', function(t) {
    const result = passwordStrength('', {
        allErrors: true
    });
    t.equal(result.key, 'error');
    t.equal(result.success, false);
    t.equal(result.message.length, 6);
    t.end();
});

test('validate weak', function(t) {
    const result = passwordStrength('testtest', {
        minUpperChars: 0,
        minSpecialChars: 0,
        minNumberChars: 0
    });
    t.equal(result.key, 'weak');
    t.equal(result.success, true);
    t.end();
});

test('validate average', function(t) {
    const result = passwordStrength('testest1', {
        minUpperChars: 0,
        minSpecialChars: 0
    });
    t.equal(result.key, 'average');
    t.equal(result.success, true);
    t.end();
});

test('validate strong', function(t) {
    const result = passwordStrength('TestTest1!');
    t.equal(result.key, 'strong');
    t.equal(result.success, true);
    t.end();
});

test('validate secure', function(t) {
    const result = passwordStrength('Test123%$/)=!');
    t.equal(result.key, 'secure');
    t.equal(result.success, true);
    t.end();
});
