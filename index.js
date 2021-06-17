const passwordStrength = require('./src');

function test(title, password, options = {}) {
    let json = passwordStrength(password, options);
    let result = JSON.stringify(json);
    process.stdout.write('\n');
    process.stdout.write('-----------------------------------------\n');
    process.stdout.write(`\n${title}: ${password}`);
    process.stdout.write(`\n\nResult:`);
    process.stdout.write(`\n${result}`);
    process.stdout.write('\n');
}

test('Empty password', '');
test('Min password length', 'test');
test('Min upper chars', 'testtest', { minUpperChars: 1 });
test('Min lower chars', 'TESTTEST', { minLowerChars: 1 });
test('Min numbers', 'TestTest', { minNumberChars: 1 });
test('Min special chars', 'TestTest1', { minSpecialChars: 1 });
test('Max consecutive repeating chars', 'TestTTTTest1!', { maxConsecutiveRepeatingChars: 2 });
test('Empty password with all possible errors', '', { allErrors: true });
test('Weak password', 'testtest', { minUpperChars: 0, minNumberChars: 0, minSpecialChars: 0 });
test('Average password', 'testest1', { minUpperChars: 0, minNumberChars: 0, minSpecialChars: 0 });
test('Strong password', 'TestTest1!');
test('Secure password', 'Test123%$/)=!');
