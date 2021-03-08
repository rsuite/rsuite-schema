const should = require('chai').should();
const schema = require('../src');
const { StringType, NumberType, Schema } = schema;

describe('#NumberType', () => {
  let schemaData = { data: NumberType() };
  let schema = new Schema(schemaData);

  it('Should be a valid number', () => {
    schema.checkForField('data', { data: '2.22' }).hasError.should.equal(false);
    schema.checkForField('data', { data: 2.22 }).hasError.should.equal(false);
    schema.checkForField('data', { data: 2 }).hasError.should.equal(false);
    schema.checkForField('data', { data: -222 }).hasError.should.equal(false);
  });

  it('Should not be checked', () => {
    schema.checkForField('data', { data: null }).hasError.should.equal(false);
    schema.checkForField('data', { data: undefined }).hasError.should.equal(false);
    schema.checkForField('data', { data: '' }).hasError.should.equal(false);
  });

  it('Should be a invalid number', () => {
    schema.checkForField('data', { data: 'abc' }).hasError.should.equal(true);
    schema.checkForField('data', { data: '1abc' }).hasError.should.equal(true);
    schema.checkForField('data', { data: {} }).hasError.should.equal(true);
    schema.checkForField('data', { data: [] }).hasError.should.equal(true);
  });

  it('True should be a invalid number', () => {
    schema.checkForField('data', { data: true }).hasError.should.equal(true);
  });

  it('Function should be a invalid number', () => {
    schema.checkForField('data', { data: function () {} }).hasError.should.equal(true);
  });

  it('Null and Undefined should be a invalid number', () => {
    let schemaData = { data: NumberType().isRequired() };
    let schema = new Schema(schemaData);
    schema.checkForField('data', { data: null }).hasError.should.equal(true);
    schema.checkForField('data', { data: undefined }).hasError.should.equal(true);
  });
});
