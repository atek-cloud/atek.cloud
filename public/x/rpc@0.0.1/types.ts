// import { SomeJSONSchema } from './vendor/ajv.d.ts'
import { CustomError } from 'https://deno.land/x/gentle_rpc@v2.9/mod.ts';
import Ajv from './vendor/avj.8.6.1.js'
const ajv = new Ajv({strict: false})

export type SomeJSONSchema = object

export type ApiSchema = {
  id: string
  type: 'api'
  title?: string
  description?: string
  definition?: {
    methods?: {
      [methodName: string]: ApiSchemaMethod
    }
  }
}

export type ApiSchemaMethod = {
  params?: SomeJSONSchema,
  response?: SomeJSONSchema
}

export function getMethod (schema: ApiSchema, methodName: string): ApiSchemaMethod {
  if (!schema?.definition?.methods?.[methodName]) {
    throw new MethodNotFound(`"${methodName}" is not a method of ${schema?.id}`)
  }
  return schema?.definition?.methods?.[methodName]
}

export function assertParamsValid (schema: SomeJSONSchema, params: any[]): void {
  const validate = ajv.compile(schema)
  const valid = validate(params)
  if (!valid) {
    const msg = `Parameter ${Number(validate.errors[0].instancePath.slice(1)) + 1} ${validate.errors[0].message}`
    throw new ParamValidationError(msg, validate.errors[0])
  }
}

export function assertResponseValid (schema: SomeJSONSchema, response: any): void {
  const validate = ajv.compile(schema)
  const valid = validate(response)
  if (!valid) {
    const msg = `Response ${validate.errors[0].schemaPath.slice(2)} ${validate.errors[0].message}`
    throw new ResponseValidationError(msg, validate.errors[0])
  }
}

export class MethodNotFound extends CustomError {
  static CODE = -32601; // we're using JSON-RPC's code for this
  constructor (msg: string, data?: any) {
    super(MethodNotFound.CODE, msg, data)
  }
}

export class ParamValidationError extends CustomError {
  static CODE = -32001;
  constructor (msg: string, data?: any) {
    super(ParamValidationError.CODE, msg, data)
  }
}

export class ResponseValidationError extends CustomError {
  static CODE = -32002;
  constructor (msg: string, data?: any) {
    super(ResponseValidationError.CODE, msg, data)
  }
}

export class GeneralError extends CustomError {
  static CODE = -32003;
  constructor (msg: string, data?: any) {
    super(GeneralError.CODE, msg, data)
  }
}