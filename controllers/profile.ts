// # sourceMappingURL=profile.js.map
require('dotenv').config();

import middy from '@middy/core';
import Ajv, { JSONSchemaType } from 'ajv';
import * as middlewares from '../middlewares';

const ajv = new Ajv();

interface MyData {
  foo: number;
  bar?: string;
}

const schema: JSONSchemaType<MyData> = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
};

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schema);

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)

export const profileCreate = middy(async (event: middlewares.Event) => {
  const a = event.body;
  if (validate(a)) {
    // data is MyData here
    console.log(a);
  } else {
    console.log(validate.errors);
  }
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profilesGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileUpdate = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileRemove = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);
