import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { DocumentClient, ItemList } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event) // TODO: should not take event
    logger.info('Getting all the todos for user.')

    const todos: DocumentClient.QueryOutput = await getTodos(userId)

    logger.info(`Found ${todos.Items.length} todos.`)

    return buildResponse(200, todos.Items)
  })

handler.use(
  cors({
    credentials: true
  })
)

async function getTodos(userId: string): Promise<DocumentClient.QueryOutput> {
  return new DocumentClient().query({
    TableName: process.env.TODO_TABLE_NAME,
    ExpressionAttributeValues: {
      ':userId': userId
    },
    KeyConditionExpression: 'userId = :userId'
  }).promise()
}

function buildResponse(statusCode: number, body: ItemList): APIGatewayProxyResult{
  return {
    statusCode,
    body: JSON.stringify(body)
  }
}

