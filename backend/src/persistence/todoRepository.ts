import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { TodoItem } from "../models/TodoItem"
import { createLogger } from "../utils/logger"

const logger = createLogger('Todo Repository')
const tableName = process.env.TODO_TABLE_NAME

export async function insertTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Inserting todo.')
    await new DocumentClient().put({
      TableName: tableName,
      Item: todo
    }).promise()
    return todo
  }

  export async function findAllTodosByUser(userId: string): Promise<DocumentClient.QueryOutput> {
    logger.info('Finding todos by user.')
    return new DocumentClient().query({
      TableName: tableName,
      ExpressionAttributeValues: {
        ':userId': userId
      },
      KeyConditionExpression: 'userId = :userId'
    }).promise()
  }