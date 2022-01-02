import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createTodo } from '../../service/todos'

const logger = createLogger('CreateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Creating todo...')
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    const {'userId': _a, ...todoResponse} = await createTodo(createTodoRequest, getUserId(event))
    return {
      statusCode: 201,
      body: JSON.stringify({todoResponse})
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
