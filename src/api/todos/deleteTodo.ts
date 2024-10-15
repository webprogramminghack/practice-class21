import { Todo } from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';
import { customAxios } from '..';

type DeleteTodoParams = {
  id: string;
};

export const deleteTodo: MutationFunction<Todo, DeleteTodoParams> = async ({
  id,
}) => {
  const response = await customAxios.delete(`/todos/${id}`);

  return response.data;
};
