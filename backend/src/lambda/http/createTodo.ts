import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodo')

interface CreateTodoDao {
  todoId: string
  userId: string
  name: string
  createdAt: string
  dueDate: string
  done: boolean
  attachmentUrl: string
}

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    logger.info(`Requesting creation of todo: ${JSON.stringify(createTodoRequest)}`)
    const newTodo: CreateTodoDao = createTodoDao(createTodoRequest.name, createTodoRequest.dueDate)
    const {'userId': _a, ...todoResponse} = await createTodo(newTodo)
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

function createTodoDao(name: string, dueDate: string): CreateTodoDao {
  return {
    todoId: uuid.v4(),
    userId: 'Ghost Rider',
    name: name,
    createdAt: Date().toString(),
    dueDate: dueDate,
    done: false,
    attachmentUrl: ''
  }
}

async function createTodo(todo: CreateTodoDao): Promise<CreateTodoDao> {
  await new DocumentClient().put({
    TableName: process.env.TODO_TABLE_NAME,
    Item: todo
  }).promise()
  return todo
}
