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
const docClient = new DocumentClient()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
    logger.info(`Updating todo ${todoId} with ${updatedTodo}`)
    
    const oldTodo = await docClient.query({
      TableName: table,
      ExpressionAttributeValues: {
        ':todoId': todoId,
        ':userId': 'Ghost Rider'
      },
      KeyConditionExpression: 'todoId = :todoId and userId = :userId'
    })
    .promise()
    .then(result => result.Items[0])

    logger.info(`Here is the old todo ${JSON.stringify(oldTodo)}`)
    
    const updatedItem = {
      todoId,
      userId: 'Ghost Rider',
      attachmentUrl: oldTodo.attachmentUrl,
      dueDate: updatedTodo.dueDate,
      createdAt: oldTodo.createdAt,
      name: updatedTodo.name,
      done: updatedTodo.done
    }

    logger.info(`Updating table ${table} with ${JSON.stringify(updatedItem)}.`)

    const response = await new DocumentClient().put({
      TableName: table,
      Item: updatedItem
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
