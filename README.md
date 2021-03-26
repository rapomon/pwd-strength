pwd-strength
============

This module takes a password string and validate it according to the specified rules.


## Install

```
npm install --save pwd-strength
```

## Settings

Here is a list of the settings currently available:

Setting                      | Default     | Description
---------------------------- | ----------- | -------------------------------------------------------------
debug                        | `false`     | Enable debug mode
minUpperChars                | `1`         | Minimum uppercase characters required `[A-Z]`.
minLowerChars                | `1`         | Minimum lowercase characters required `[a-z]`.
minNumberChars               | `1`         | Minimum numbers required `[0-9]`.
minSpecialChars              | `1`         | Minimum symbols required (any character not in `[a-zA-Z]`).
minPasswordLength            | `8`         | Minimum password length required.
maxConsecutiveRepeatingChars | `2`         | Maximum consecutive repeating characters allowed.
lang                         | *See below* | Object with multi-language strings.
colors                       | *See below* | Object with the colors depending on the strength.

## Language settings

Here is a list of the language settings currently available:

Language setting             | Translation
---------------------------- | ------------------------------------------------------------------
weak                         | *Weak*
average                      | *Average*
strong                       | *Strong*
secure                       | *Secure*
minPasswordChar              | *At least %s character please*
minPasswordChars             | *At least %s characters please*
minLowerChar                 | *At least %s lowercase character please*
minLowerChars                | *At least %s lowercase characters please*
minUpperChar                 | *At least %s uppercase character please*
minUpperChars                | *At least %s uppercase characters please*
minNumberChar                | *At least %s number please*
minNumberChars               | *At least %s numbers please*
minSpecialChar               | *At least %s special character please*
minSpecialChars              | *At least %s special characters please*
maxConsecutiveRepeatingChars | *No more than %s consecutive repeating characters or numbers please*

## Color settings

Here is a list of the color settings depending on the strength currently available:

Color setting | Default
------------- | --------------------------------------------
error         | <span style="color:#ee0000;">#ee0000</span>
weak          | <span style="color:#c43d4b;">#c43d4b</span>
average       | <span style="color:#cc9900;">#cc9900</span>
strong        | <span style="color:#569f0c;">#569f0c</span>
secure        | <span style="color:#007000;">#007000</span>

## Testing the library

```js
    const passwordStrength = require('pwd-strength');
    
    let result = passwordStrength('Test');
```

The function returns an object as follows:

```js
    {
        "success":false|true, // false if any error occurs, otherwise true
        "key":"error|weak|average|strong|secure", // Indicates error or the strength
        "message":"Error message or strength", // Multilanguage string with the error message or strength
        "color":"#rrggbb" // Hex color depending on the key
    }
```

## Examples

Default settings, the first error checked will be the password length:

```js
    console.log(passwordStrength('Test'));
    // {"success":false,"key":"error","message":"At least 8 characters please","color":"#ee0000"}
```

Minimum uppercase characters:

```js
    console.log(passwordStrength('testtest', { minUpperChars: 1 }));
    // {"success":false,"key":"error","message":"At least 1 uppercase character please","color":"#ee0000"}
```

Minimum lowercase characters:

```js
    console.log(passwordStrength('TESTTEST', { minLowerChars: 1 }));
    // {"success":false,"key":"error","message":"At least 1 lowercase character please","color":"#ee0000"}
```

Minimum numbers:

```js
    console.log(passwordStrength('TestTest', { minNumberChars: 1 }));
    // {"success":false,"key":"error","message":"At least 1 number please","color":"#ee0000"}
```

Minimum symbols:

```js
    console.log(passwordStrength('TestTest1', { minSpecialChars: 1 }));
    // {"success":false,"key":"error","message":"At least 1 special character please","color":"#ee0000"}
```

Maximum consecutive repeating characters allowed:

```js
    console.log(passwordStrength('TestTTTTest1', { maxConsecutiveRepeatingChars: 2 }));
    // {"success":false,"key":"error","message":"No more than 2 consecutive repeating characters or numbers please","color":"#ee0000"}
```

Success result, with weak password:

```js
    console.log(passwordStrength('testtest', { minUpperChars: 0, minSpecialChars: 0 }));
    // {"success":true,"key":"weak","message":"Weak","color":"#c43d4b"}
```

Success result, with average password:

```js
    console.log(passwordStrength('testest1', { minUpperChars: 0 }));
    // {"success":true,"key":"average","message":"Average","color":"#cc9900"}
```

Success result, with strong password, and default settings:

```js
    console.log(passwordStrength('TestTest1!'));
    // {"success":true,"key":"strong","message":"Strong","color":"#569f0c"}
```

Success result, with secure password, and default settings:

```js
    console.log(passwordStrength('Test123%$/)=!'));
    // {"success":true,"key":"secure","message":"Secure","color":"#007000"}
```
