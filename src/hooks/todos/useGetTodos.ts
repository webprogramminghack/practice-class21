import { useQuery } from '@tanstack/react-query';
import { getTodos, TodosQueryKey } from '@/api/todos/getTodos';
import { Todo } from '@/models/todo';

type UseGetTodosParams = {
  completed?: boolean;
  limit?: number;
  page?: number;
  sort?: 'title' | 'date';
  order?: 'asc' | 'desc';
};

type UseGetTodosReturn = {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
  isFetching: boolean;
  error: Error | null;
  queryKey: TodosQueryKey;
};

export const useGetTodos = ({
  completed,
  limit = 10,
  page = 1,
  sort = 'date',
  order = 'asc',
}: UseGetTodosParams = {}): UseGetTodosReturn => {
  const queryKey: TodosQueryKey = [
    'todos',
    { completed, limit, page, sort, order },
  ];

  const { data, error, isFetching } = useQuery({
    queryKey,
    queryFn: getTodos,
  });

  const todos = data?.todos ?? [];
  const totalTodos = data?.totalTodos ?? 0;
  const hasNextPage = data?.hasNextPage ?? false;
  const nextPage = data?.nextPage ?? null;

  return {
    todos,
    totalTodos,
    hasNextPage,
    nextPage,
    isFetching,
    error,
    queryKey,
  };
};
