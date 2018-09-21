# schema-typed

Schema for data modeling & validation

[![npm][npm-badge]][npm]
[![Travis][build-badge]][build]

English | [中文版][readm-cn]

## Installation

```
npm install schema-typed --save
```

## Usage

```js
import { SchemaModel, StringType, DateType, NumberType } from 'schema-typed';

const model = SchemaModel({
  username: StringType().isRequired('Username required'),
  email: StringType().isEmail('Email required'),
  age: NumberType('Age should be a number').range(
    18,
    30,
    'Age should be between 18 and 30 years old'
  )
});

model.check(
  {
    username: 'foobar',
    email: 'foo@bar.com',
    age: 40
  },
  checkResult => console.log(checkResult)
);
```

`checkResult` return structure is:

```js
{
    username: { hasError: false },
    email: { hasError: false },
    age: { hasError: true, errorMessage: 'Age should be between 18 and 30 years old' }
}
```

## Multiple verification

```js
StringType()
  .minLength(6, "Can't be less than 6 characters")
  .maxLength(30, 'Cannot be greater than 30 characters')
  .isRequired('This field required');
```

## Custom verification

Customize a rule with the `addRule` function.

If you are validating a string type of data, you can set a regular expression for custom validation by the `pattern` method.

```js
const model = SchemaModel({
  field1: StringType().addRule(
    (value, data, callback) => callback(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value)),
    'Please enter legal characters'
  ),
  field2: StringType().pattern(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/, 'Please enter legal characters')
});

model.check({ field1: '', field2: '' }, checkResult => console.dir(checkResult));

/**
{
  field1: {
    hasError: true,
    errorMessage: 'Please enter legal characters'
  },
  field2: {
    hasError: true,
    errorMessage: 'Please enter legal characters'
  }
};
**/
```

## Custom verification - multi-field cross validation

E.g: verify that the two passwords are the same.

```js
const model = SchemaModel({
  password1: StringType().isRequired('This field required'),
  password2: StringType().addRule((value, data, callback) => {
    if (value !== data.password1) {
      return callback(false);
    }

    return callback(true);
  }, 'The passwords are inconsistent twice')
});

model.check({ password1: '123456', password2: 'root' }, checkResult => console.dir(checkResult));

/**
{
  password1: { hasError: false },
  password2: {
    hasError: true,
    errorMessage: 'The passwords are inconsistent twice'
  }
};
**/
```

## Asynchronous verification

```js
const model = SchemaModel({
  username: StringType()
    .addRule((value, data, callback) => {
      fetch('https://example.com/validateUsername', { username: value })
        .then(({ result }) => callback(result) )
        .catch(() => callback());
    }, 'Username is not valid')
    .isRequired('Username is required'),
});
```

## Validate nested objects

Validate nested objects, which can be defined using the `ObjectType().shape` method. E.g:

```js
const model = SchemaModel({
  id: NumberType().isRequired('This field required'),
  name: StringType().isRequired('This field required'),
  info: ObjectType().shape({
    email: StringType().isEmail('Should be an email'),
    age: NumberType().min(18, 'Age should be greater than 18 years old')
  })
});

model.check({
  id: 1,
  name: 'schema-type',
  info: {
    email: 'schema-type@gmail.com',
    age: 17
  }
}, checkResult => console.dir(checkResult));

/**
{
  id: { hasError: false },
  name: { hasError: false },
  info: {
    hasError: true,
    errorMessage: 'Age should be greater than 18 years old'
  }
}
**/
```

You also can use like `a.b` syntax.

```js
const model = SchemaModel({
  id: NumberType().isRequired('This field required'),
  name: StringType().isRequired('This field required'),
  'info.email': StringType().isEmail('Should be an email'),
  'info.age': NumberType().min(18, 'Age should be greater than 18 years old')
});

model.check({
  id: 1,
  name: 'schema-type',
  info: {
    email: 'schema-type@gmail.com',
    age: 17
  }
}, checkResult => console.dir(checkResult));

/**
{
  id: { hasError: false },
  name: { hasError: false },
  info: {
    email: { hasError: false },
    age：{
      hasError: true,
      errorMessage: 'Age should be greater than 18 years old'
    }
  }
}
**/
```

## Combine

`SchemaModel` provides a static method `combine` that can be combined with multiple `SchemaModel` to return a new `SchemaModel`.

```js
const model1 = SchemaModel({
  username: StringType().isRequired('This field required'),
  email: StringType().isEmail('Should be an email')
});

const model2 = SchemaModel({
  username: StringType().minLength(7, "Can't be less than 7 characters"),
  age: NumberType().range(18, 30, 'Age should be greater than 18 years old')
});

const model3 = SchemaModel({
  groupId: NumberType().isRequired('This field required')
});

const model4 = SchemaModel.combine(model1, model2, model3);

model4.check({
  username: 'foobar',
  email: 'foo@bar.com',
  age: 40,
  groupId: 1
}, checkResult => console.dir(checkResult));
```

## API

- SchemaModel
- StringType
- NumberType
- ArrayType
- DateType
- ObjectType
- BooleanType

### SchemaModel

- `static` combine(...models)

```js
const model1 = SchemaModel({
  username: StringType().isRequired('This field required')
});

const model2 = SchemaModel({
  email: StringType().isEmail('Please input the correct email address')
});

const model3 = SchemaModel.combine(model1, model2);
```

- check(data: Object)

```js
const model = SchemaModel({
  username: StringType().isRequired('This field required'),
  email: StringType().isEmail('Please input the correct email address')
});

model.check({
  username: 'root',
  email: 'root@email.com'
}, checkResult => console.dir(checkResult));
```

- checkForField(fieldName: string, fieldValue: any, data: Object)

```js
const model = SchemaModel({
  username: StringType().isRequired('This field required'),
  email: StringType().isEmail('Please input the correct email address')
});

model.checkForField(
  'username',
  'root',
  checkResult => console.dir(checkResult)
);
```

### StringType

- isRequired(errorMessage: string)

```js
StringType().isRequired('This field required');
```

- isEmail(errorMessage: string)

```js
StringType().isEmail('Please input the correct email address');
```

- isURL(errorMessage: string)

```js
StringType().isURL('Please enter the correct URL address');
```

- isOneOf(items: Array, errorMessage: string)

```js
StringType().isOneOf(['Javascript', 'CSS'], 'Can only type `Javascript` and `CSS`');
```

- containsLetter(errorMessage: string)

```js
StringType().containsLetter('Must contain English characters');
```

- containsUppercaseLetter(errorMessage: string)

```js
StringType().containsUppercaseLetter('Must contain uppercase English characters');
```

- containsLowercaseLetter(errorMessage: string)

```js
StringType().containsLowercaseLetter('Must contain lowercase English characters');
```

- containsLetterOnly(errorMessage: string)

```js
StringType().containsLetterOnly('English characters that can only be included');
```

- containsNumber(errorMessage: string)

```js
StringType().containsNumber('Must contain numbers');
```

- pattern(regExp: RegExp, errorMessage: string)

```js
StringType().pattern(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/, 'Please enter legal characters');
```

- rangeLength(minLength: number, maxLength: number, errorMessage: string)

```js
StringType().rangeLength(6, 30, 'The number of characters can only be between 6 and 30');
```

- minLength(minLength: number, errorMessage: string)

```js
StringType().minLength(6, 'Minimum 6 characters required');
```

- maxLength(maxLength: number, errorMessage: string)

```js
StringType().maxLength(30, 'The maximum is only 30 characters.');
```

- addRule(onValid: Function, errorMessage: string)

```js
StringType().addRule((value, data, callback) => {
  return callback(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(value));
}, 'Please enter a legal character.');
```

### NumberType

- isRequired(errorMessage: string)

```js
NumberType().isRequired('This field required');
```

- isInteger(errorMessage: string)

```js
NumberType().isInteger('It can only be an integer');
```

- isOneOf(items: Array, errorMessage: string)

```js
NumberType().isOneOf([5, 10, 15], 'Can only be `5`, `10`, `15`');
```

- pattern(regExp: RegExp, errorMessage: string)

```js
NumberType().pattern(/^[1-9][0-9]{3}$/, 'Please enter a legal character.');
```

- range(minLength: number, maxLength: number, errorMessage: string)

```js
NumberType().range(18, 40, 'Please enter a number between 18 - 40');
```

- min(min: number, errorMessage: string)

```js
NumberType().min(18, 'Minimum 18');
```

- max(max: number, errorMessage: string)

```js
NumberType().max(40, 'Maximum 40');
```

- addRule(onValid: Function, errorMessage: string)

```js
NumberType().addRule((value, data, callback) => {
  return callback(value % 5 === 0);
}, 'Please enter a valid number');
```

### ArrayType

- isRequired(errorMessage: string)

```js
ArrayType().isRequired('This field required');
```

- rangeLength(minLength: number, maxLength: number, errorMessage: string)

```js
ArrayType().rangeLength(1, 3, 'Choose at least one, but no more than three');
```

- minLength(minLength: number, errorMessage: string)

```js
ArrayType().minLength(1, 'Choose at least one');
```

- maxLength(maxLength: number, errorMessage: string)

```js
ArrayType().maxLength(3, "Can't exceed three");
```

- unrepeatable(errorMessage: string)

```js
ArrayType().unrepeatable('Duplicate options cannot appear');
```

- of(type: Object, errorMessage: string)

```js
ArrayType().of(StringType().isEmail(), 'wrong format');
```

- addRule(onValid: Function, errorMessage: string)

```js
ArrayType().addRule((value, data, callback) => {
  return callback(value.length % 2 === 0);
}, 'Good things are in pairs');
```

### DateType

- isRequired(errorMessage: string)

```js
DateType().isRequired('This field required');
```

- range(min: Date, max: Date, errorMessage: string)

```js
DateType().range(
  new Date('08/01/2017'),
  new Date('08/30/2017'),
  'Date should be between 08/01/2017 - 08/30/2017'
);
```

- min(min: Date, errorMessage: string)

```js
DateType().min(new Date('08/01/2017'), 'Minimum date 08/01/2017');
```

- max(max: Date, errorMessage: string)

```js
DateType().max(new Date('08/30/2017'), 'Maximum date 08/30/2017');
```

- addRule(onValid: Function, errorMessage: string)

```js
DateType().addRule((value, data, callback) => {
  return callback(value.getDay() === 2);
}, 'Can only choose Tuesday');
```

### ObjectType

- isRequired(errorMessage: string)

```js
ObjectType().isRequired('This field required');
```

- shape(type: Object)

```js
ObjectType().shape({
  email: StringType().isEmail('Should be an email'),
  age: NumberType().min(18, 'Age should be greater than 18 years old')
});
```

- addRule(onValid: Function, errorMessage: string)

```js
ObjectType().addRule((value, data, callback) => {
  if (value.id || value.email) {
    return callback(true);
  }
  return callback(false);
}, 'Id and email must have one that cannot be empty');
```

### BooleanType

- isRequired(errorMessage: string)

```js
BooleanType().isRequired('This field required');
```

- addRule(onValid: Function, errorMessage: string)

```js
ObjectType().addRule((value, data, callback) => {
  if (typeof value === 'undefined' && A === 10) {
    return callback(false);
  }
  return callback(true);
}, 'This value is required when A is equal to 10');
```

[readm-cn]: https://github.com/rsuite/schema-typed/blob/master/README_zh.md
[npm-badge]: https://img.shields.io/npm/v/schema-typed.svg
[npm]: https://www.npmjs.com/package/schema-typed
[npm-beta-badge]: https://img.shields.io/npm/v/schema-typed/beta.svg
[npm-beta]: https://www.npmjs.com/package/schema-typed
[build-badge]: https://travis-ci.org/rsuite/schema-typed.svg
[build]: https://travis-ci.org/rsuite/schema-typed
[coverage-badge]: https://coveralls.io/repos/github/rsuite/schema-typed/badge.svg?branch=next
[coverage]: https://coveralls.io/github/rsuite/schema-typed
