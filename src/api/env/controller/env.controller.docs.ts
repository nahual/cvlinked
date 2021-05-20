import Docs from "../../../lib/docs";

class EnvDocs extends Docs {

    constructor(){
      super()
    }
  
    'get /api/env'() {
      return {
        tags: ['env'],
        summary: 'Returns the setted ENV variables',
        security: [
          { bearerToken: [] }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    API_NAME: {
                      type: 'string',
                      example: 'API'
                    },
                    PORT: {
                        type: 'number',
                        example: 3000
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'you are not allowed to access endpoint GET /api/env ...'
                    },
                    internal_code: {
                      type: 'string',
                      example: 'unauthorized'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  export const Doc = EnvDocs;