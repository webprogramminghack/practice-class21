import { ScrollTodosQueryKey } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { updateTodo } from '@/api/todos/updateTodo';
import { Todo } from '@/models/todo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type UpdateTodoVariables = {
  payload: Todo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation<
    void | Todo,
    Error,
    UpdateTodoVariables
  >({
    mutationFn: updateTodo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    updateTodo: updateTodoMutation.mutateAsync,
    isDeleting: updateTodoMutation.isPending,
    error: updateTodoMutation.error,
  };
};
