import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../service/todos'
import { getUserId } from '../utils'

const logger = createLogger('UpdateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event.headers.Authorization)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
    logger.info(`Reeived requst to update todo ${todoId}`)
    updateTodo(todoId, userId, updatedTodo)

    return {
        statusCode: 200,
        body: ''
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
