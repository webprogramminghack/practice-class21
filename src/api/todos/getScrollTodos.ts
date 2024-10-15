import { Todo } from '@/models/todo';
import { QueryFunction } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { customAxios } from '..';

export type ScrollTodosQueryKey = [
  string,
  string,
  {
    completed?: boolean;
    limit?: number;
    sort?: 'title' | 'date';
    order?: 'asc' | 'desc';
  }
];

export type TodosResponse = {
  todos: Todo[];
  nextCursor: number | null;
  hasNextPage: boolean;
};

export const getScrollTodos: QueryFunction<
  TodosResponse,
  ScrollTodosQueryKey,
  number
> = async ({ queryKey, pageParam = 0 }) => {
  const [
    path,
    subPath,
    { completed, limit = 10, sort = 'date', order = 'asc' },
  ] = queryKey;

  const apiPath = `/${path}/${subPath}`;

  const axiosRequestConfig: AxiosRequestConfig = {
    params: { completed, limit, sort, order, nextCursor: pageParam },
  };

  const response = await customAxios.get(apiPath, axiosRequestConfig);

  return response.data;
};
