import { NewTodo, Todo } from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';
import { customAxios } from '..';

type CreateTodoParams = {
  payload: NewTodo;
};

export const createTodo: MutationFunction<Todo, CreateTodoParams> = async ({
  payload,
}) => {
  const response = await customAxios.post('/todos', payload);

  return response.data;
};
