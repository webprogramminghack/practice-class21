import { deleteTodo } from '@/api/todos/deleteTodo';
import { ScrollTodosQueryKey } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { Todo } from '@/models/todo';
import {
  useMutation,
  useQueryClient,
  UseMutateAsyncFunction,
} from '@tanstack/react-query';

type DeleteTodoVariables = {
  id: string;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type UseDeleteTodoReturn = {
  deleteTodo: UseMutateAsyncFunction<void | Todo, Error, DeleteTodoVariables>;
  isDeleting: boolean;
  error: Error | null;
};

export const useDeleteTodo = (): UseDeleteTodoReturn => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation<
    void | Todo,
    Error,
    DeleteTodoVariables
  >({
    mutationFn: deleteTodo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    deleteTodo: deleteTodoMutation.mutateAsync,
    isDeleting: deleteTodoMutation.isPending,
    error: deleteTodoMutation.error,
  };
};
