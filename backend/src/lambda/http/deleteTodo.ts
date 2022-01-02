import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../service/todos'
import { getUserId } from '../utils'

const logger = createLogger('DeleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info(`Attempting to delete todo with id: ${todoId} from table: `)
    await deleteTodo(todoId, getUserId(event.headers.Authorization))

    return {
        statusCode: 204,
        body: ''
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
