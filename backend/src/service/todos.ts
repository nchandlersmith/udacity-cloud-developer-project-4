import * as uuid from 'uuid'
import { TodoItem } from "../models/TodoItem";
import { insertTodo } from '../persistence/todoRepository';
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    return insertTodo(buildTodo(createTodoRequest, userId))
}

function buildTodo(createTodoRequest: CreateTodoRequest, userId: string): TodoItem {
    return {
      todoId: uuid.v4(),
      userId,
      name: createTodoRequest.name,
      createdAt: Date().toString(),
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: ''
    }
  }