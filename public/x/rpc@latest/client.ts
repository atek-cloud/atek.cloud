import { createRemote } from 'https://deno.land/x/gentle_rpc@v2.9/mod.ts'
import { BadServerDataError } from 'https://deno.land/x/gentle_rpc@v2.9/client/error.ts'
import { ApiSchema, getMethod, assertParamsValid, assertResponseValid, ParamValidationError, ResponseValidationError, GeneralError } from './types.ts'

export class JsonRpcClient {
  _remote
  _schema: ApiSchema

  constructor (schema: ApiSchema) {
    this._schema = schema
    this._remote = createRemote('http://0.0.0.0:8000') // TODO
  }

  async _rpc (methodName: string, params: any[] = []): Promise<any> {
    try {
      const methodDef = getMethod(this._schema, methodName)
      if (methodDef.params) assertParamsValid(methodDef.params, params)
      else if (params.length) throw new Error(`Invalid parameter: ${methodName} takes no arguments`)
      const response = await this._remote[methodName](params)
      if (methodDef.response) assertResponseValid(methodDef.response, response)
      else if (typeof response !== 'undefined') throw new Error(`Invalid response: ${methodName} has no response`)
      return response
    } catch (e) {
      if (e instanceof ParamValidationError) throw e
      if (e instanceof ResponseValidationError) throw e
      if (e instanceof BadServerDataError) {
        switch (e.code) {
          case ParamValidationError.CODE:
            throw new ParamValidationError(e.message, e.data)
          case ResponseValidationError.CODE:
            throw new ResponseValidationError(e.message, e.data)
          case GeneralError.CODE:
            throw new GeneralError(e.message, e.data)
        }
      }
      throw e
    }
  }
}