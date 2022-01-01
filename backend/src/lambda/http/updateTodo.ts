import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const logger = createLogger('UpdateTodo')
const table = process.env.TODO_TABLE_NAME

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info(`Attempting to update id ${todoId} with ${updatedTodo} on ${table}`)

    const item = {
      todoId,
      userId: 'Ghost Rider',
      ...updatedTodo
    }

    const response = await new DocumentClient().put({
      TableName: table,
      Item: item
    }).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({message: response})
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
