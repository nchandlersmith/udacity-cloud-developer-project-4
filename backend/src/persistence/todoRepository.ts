import * as AWSXRay from 'aws-xray-sdk'
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from "../models/TodoItem"
import { createLogger } from "../utils/logger"

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

const logger = createLogger('Todo Repository')
const tableName = process.env.TODO_TABLE_NAME
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function insertTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Inserting todo.')
    await docClient.put({
      TableName: tableName,
      Item: todo
    }).promise()
    return todo
  }

export async function findTodoById(todoId: string, userId: string): Promise<DocumentClient.QueryOutput> {
  logger.info(`Finding todo: ${todoId}`)
  const response =  await docClient.query({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':todoId': todoId,
      ':userId': userId
    },
    KeyConditionExpression: 'todoId = :todoId and userId = :userId'
  }).promise()
  return response.Items[0]
}

export async function findAllTodosByUser(userId: string): Promise<DocumentClient.QueryOutput> {
  logger.info('Finding todos by user.')
  return await docClient.query({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':userId': userId
    },
    KeyConditionExpression: 'userId = :userId'
  }).promise()
}

export async function deleteTodoByTodoAndUserIds(todoId: string, userId: string): Promise<void> {
  logger.info(`Deleting todo: ${todoId}`)
  await docClient.delete({
    TableName: tableName,
    Key: {
        "todoId": todoId,
        "userId": userId
    }
}).promise()
}

export async function updateAttachmentUrlByTodoAndUserIds(todoId: string, userId: string): Promise<DocumentClient.Update> {
  const url = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  logger.info(`Updating table ${tableName} using ${todoId} with attchment url ${url}`)
  return docClient.update({
    TableName: tableName,
    Key: {
      "todoId": todoId,
      "userId": userId
    },
    UpdateExpression: "set attachmentUrl = :url",
    ExpressionAttributeValues: {
      ":url": url
    }
  }).promise()
}