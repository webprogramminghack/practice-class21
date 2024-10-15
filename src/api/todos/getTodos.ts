import { AxiosRequestConfig } from 'axios';
import { QueryFunction } from '@tanstack/react-query';
import { customAxios } from '@/api';
import { Todo } from '@/models/todo';

export type TodosQueryKey = [
  string,
  {
    completed?: boolean;
    page?: number;
    limit?: number;
    sort: 'title' | 'date';
    order: 'asc' | 'desc';
  }
];

export type TodosResponse = {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
};

export const getTodos: QueryFunction<TodosResponse, TodosQueryKey> = async ({
  queryKey,
}) => {
  const [
    path,
    { completed, page = 1, limit = 10, sort = 'date', order = 'asc' },
  ] = queryKey;

  const apiPath = `/${path}`;

  const axiosRequestConfig: AxiosRequestConfig = {
    params: { completed, page, limit, sort, order },
  };

  const response = await customAxios.get<TodosResponse>(
    apiPath,
    axiosRequestConfig
  );

  return response.data;
};
