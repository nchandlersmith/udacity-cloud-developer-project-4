import * as uuid from 'uuid'
import { TodoItem } from "../models/TodoItem";
import { deleteTodoByTodoAndUserIds, findAllTodosByUser, findTodoById, insertTodo } from '../persistence/todoRepository';
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';

const logger = createLogger('Todos Service')

export async function getTodos(userId: string): Promise<TodoItem[]> {
    const todos = await findAllTodosByUser(userId)
    return todos.Items as TodoItem[]
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info('Creating todo.')
    return insertTodo(buildTodo(createTodoRequest, userId))
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  logger.info('Deleting todo.')
  await deleteTodoByTodoAndUserIds(todoId, userId)
}

export async function updateTodo(todoId: string, userId: string, update: UpdateTodoRequest): Promise<void> {
  const oldTodo = await findTodoById(todoId, userId) as TodoItem
  logger.info('Found old todo')
  const updatedItem: TodoItem = {
    todoId,
    userId,
    attachmentUrl: oldTodo.attachmentUrl,
    dueDate: update.dueDate,
    createdAt: oldTodo.createdAt,
    name: update.name,
    done: update.done
  }
  insertTodo(updatedItem)
  logger.info('Finished updating todo')
}

function buildTodo(createTodoRequest: CreateTodoRequest, userId: string): TodoItem {
    logger.info('Building TodoItem from request.')
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