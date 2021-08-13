import { ServerRequest } from 'https://deno.land/std@0.99.0/http/server.ts';
import { respond } from 'https://deno.land/x/gentle_rpc@v2.9/mod.ts';
import { ApiSchema, getMethod, assertParamsValid, assertResponseValid, ParamValidationError, ResponseValidationError, GeneralError } from './types.ts'

export type JsonRpcServerHandlers = {
  [key: string]: (...params: any[]) => any
}

export type JsonRpcServerMethods = {
  [key: string]: (...params: any[]) => any
}

export class JsonRpcServer {
  schema: ApiSchema
  handlers: JsonRpcServerHandlers
  methods: JsonRpcServerMethods

  constructor (schema: ApiSchema, handlers: JsonRpcServerHandlers) {
    this.schema = schema
    this.handlers = handlers
    this.methods = generateServerMethods(schema, handlers)
  }

  async respond (req: ServerRequest): Promise<void> {
    return respond(this.methods, req)
  }
}

function generateServerMethods (schema: ApiSchema, handlers: JsonRpcServerHandlers): JsonRpcServerMethods {
  const methods: JsonRpcServerMethods = {}

  for (let methodName in handlers) {
    const methodDef = getMethod(schema, methodName)

    methods[methodName] = async (params: [any]): Promise<any> => {
      try {
        if (methodDef.params) assertParamsValid(methodDef.params, params)
        else if (params.length) throw new Error(`Invalid parameter: ${methodName} takes no arguments`)
        const response = await handlers[methodName](...params)
        if (methodDef.response) assertResponseValid(methodDef.response, response)
        else if (typeof response !== 'undefined') throw new Error(`Invalid response: ${methodName} has no response`)
        return response
      } catch (e) {
        if (e instanceof ParamValidationError) throw e
        if (e instanceof ResponseValidationError) throw e
        throw new GeneralError(e.message || e.toString())
      }
    }
  }

  return methods
}
