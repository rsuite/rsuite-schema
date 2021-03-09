import { SchemaModel, Schema } from './Schema';
import { default as MixedType } from './MixedType';
import { default as StringType } from './StringType';
import { default as NumberType } from './NumberType';
import { default as ArrayType } from './ArrayType';
import { default as DateType } from './DateType';
import { default as ObjectType } from './ObjectType';
import { default as BooleanType } from './BooleanType';

export {
  SchemaModel,
  Schema,
  MixedType,
  StringType,
  NumberType,
  ArrayType,
  DateType,
  ObjectType,
  BooleanType
};

export default {
  Model: SchemaModel,
  Types: {
    MixedType,
    StringType,
    NumberType,
    ArrayType,
    DateType,
    ObjectType,
    BooleanType
  }
};
