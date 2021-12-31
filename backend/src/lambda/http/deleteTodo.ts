import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


// import { deleteTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

const logger = createLogger('DeleteTodo')
const table = process.env.TODO_TABLE_NAME

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    logger.info(`Attempting to delete todo with id: ${todoId} from table: `)

    await new DocumentClient().delete({
        TableName: table,
        Key: {
            "todoId": todoId,
            "userId": "Ghost Rider"
        }
    }).promise().catch(error => {
        const message = `Error encountered while deleting ${todoId}. Error: ${JSON.stringify(error)}`
        console.error(message)
        return {
            statusCode: 500,
            body: JSON.stringify({message})
        }
    })

    return {
        statusCode: 204,
        body: JSON.stringify({event: `${event}`})
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
