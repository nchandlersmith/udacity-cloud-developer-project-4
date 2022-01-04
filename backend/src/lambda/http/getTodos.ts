import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getTodos } from '../../service/todos'
import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('Get Todos Lambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event.headers.Authorization)
    
    logger.info('Getting all the todos for user.')
    const todos: TodoItem[] = await getTodos(userId)
    logger.info(`Found ${todos.length} todos.`)

    return buildResponse(200, {items: todos})
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)

function buildResponse(statusCode: number, body: any): APIGatewayProxyResult{
  return {
    statusCode,
    body: JSON.stringify(body)
  }
}

