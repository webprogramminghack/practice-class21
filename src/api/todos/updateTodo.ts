import { Todo } from '@/models/todo';
import { MutationFunction } from '@tanstack/react-query';
import { customAxios } from '..';

type UpdateTodoParams = {
  payload: Todo;
};

export const updateTodo: MutationFunction<
  Todo | void,
  UpdateTodoParams
> = async ({ payload: { id, title, completed, date } }) => {
  const response = await customAxios.put(`/todos/${id}`, {
    title,
    completed,
    date,
  });

  return response.data;
};
