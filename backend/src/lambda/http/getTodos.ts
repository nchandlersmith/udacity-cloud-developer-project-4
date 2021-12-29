import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


const logger = createLogger('GetTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting all the todos for Ghost Rider ', event)
    const todos = await new DocumentClient().query({
        TableName: process.env.TODO_TABLE_NAME,
        ExpressionAttributeValues: {
          ':userId': 'Ghost Rider'
        },
        KeyConditionExpression: 'userId = :userId'
    }).promise()

    logger.info(`Found these items for Ghost Rider: ${JSON.stringify(todos.Items)}`)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({items: todos.Items})
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
