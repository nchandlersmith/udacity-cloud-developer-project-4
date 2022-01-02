import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { TodoItem } from "../models/TodoItem"


export async function insertTodo(todo: TodoItem): Promise<TodoItem> {
    await new DocumentClient().put({
      TableName: process.env.TODO_TABLE_NAME,
      Item: todo
    }).promise()
    return todo
  }