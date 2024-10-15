import { createTodo } from '@/api/todos/createTodo';
import { ScrollTodosQueryKey } from '@/api/todos/getScrollTodos';
import { TodosQueryKey } from '@/api/todos/getTodos';
import { NewTodo, Todo } from '@/models/todo';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export type CreateTodoVariables = {
  payload: NewTodo;
  queryKey: TodosQueryKey | ScrollTodosQueryKey;
};

type UseCreateTodoReturn = {
  createTodo: UseMutateAsyncFunction<void | Todo, Error, CreateTodoVariables>;
  isCreating: boolean;
  error: Error | null;
};

export const useCreateTodo = (): UseCreateTodoReturn => {
  const queryClient = useQueryClient();

  const createTodoMutation = useMutation<
    void | Todo,
    Error,
    CreateTodoVariables
  >({
    mutationFn: createTodo,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: variables.queryKey });
    },
  });

  return {
    createTodo: createTodoMutation.mutateAsync,
    isCreating: createTodoMutation.isPending,
    error: createTodoMutation.error,
  };
};
