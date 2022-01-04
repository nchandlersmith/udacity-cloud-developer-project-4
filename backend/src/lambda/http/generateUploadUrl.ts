import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { createUploadUrl } from '../../service/attachments'

const logger = createLogger('GenerateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    logger.info(`Generating url attachment url for todoId: ${todoId}`)
    const url = createUploadUrl(todoId)
    logger.info(`${todoId} image url: ${url}`)
    
    return {
        statusCode: 200,
        body: JSON.stringify({uploadUrl: url})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
