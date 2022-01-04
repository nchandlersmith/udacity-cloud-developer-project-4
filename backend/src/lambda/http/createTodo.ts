import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createTodo } from '../../service/todos'

const logger = createLogger('CreateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    
    logger.info(`Creating todo from request: ${JSON.stringify(createTodoRequest)}`)
    const {'userId': _a, ...todoResponse} = await createTodo(createTodoRequest, getUserId(event.headers.Authorization))
    logger.info(`Todo created: ${JSON.stringify(todoResponse)}`)

    return buildResponse(201, todoResponse)
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)

interface TodoResponse {
  todoId: string;
  createdAt: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;

}

function buildResponse(statusCode: number, todoResponse: TodoResponse) {
  return {
    statusCode,
    body: JSON.stringify({item: todoResponse})
  }
}
