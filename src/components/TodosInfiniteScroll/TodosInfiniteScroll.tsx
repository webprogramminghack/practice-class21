import {
  CreateTodoVariables,
  useCreateTodo,
} from '@/hooks/todos/useCreateTodo';
import { useGetInfiniteTodos } from '@/hooks/todos/useGetInfiniteTodos';
import {
  UpdateTodoVariables,
  useUpdateTodo,
} from '@/hooks/todos/useUpdateTodo';
import React, { FormEvent, MouseEvent, KeyboardEvent, useState } from 'react';
import TrashIcon from '@/assets/svg/icon-trash.svg';
import styles from './TodosInfiniteScroll.module.scss';
import { useIntersectionObserver } from '@/hooks/general/useIntersectionObserver';
import { useOptimisticDeleteInfiniteTodo } from '@/hooks/todos/useDeleteInfinteTodo';

export const TodosInfiniteScroll: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryKey,
  } = useGetInfiniteTodos({
    order: 'desc',
    limit: 10,
  });

  const [newTodoText, setNewTodoText] = useState('');

  const { createTodo, isCreating } = useCreateTodo();
  const { deleteTodo } = useOptimisticDeleteInfiniteTodo();
  const { updateTodo } = useUpdateTodo();

  const { containerRef, lastElementRef } = useIntersectionObserver<
    HTMLLIElement,
    HTMLUListElement
  >({
    callback: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const variables: CreateTodoVariables = {
      payload: { title: newTodoText, completed: false },
      queryKey,
    };

    if (newTodoText.trim()) {
      createTodo(variables);
      setNewTodoText('');
    }
  };

  const handleDeleteTodo = (e: MouseEvent<SVGElement>) => {
    const id = e.currentTarget.dataset.id;

    if (id) {
      deleteTodo({ id, queryKey });
    }
  };

  const handleUpdateTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const newValue = input.value.trim();
      const todoId = input.dataset.id;

      if (todoId && newValue) {
        const todoToUpdate = todos.find((todo) => todo.id === todoId);

        if (todoToUpdate) {
          const variables: UpdateTodoVariables = {
            payload: { ...todoToUpdate, title: newValue },
            queryKey,
          };

          updateTodo(variables);
        }
      }
    }
  };

  return (
    <div className={styles.todoContainer}>
      <form onSubmit={onSubmitForm}>
        <input
          type='text'
          value={newTodoText}
          className={styles.newTodoInput}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
      </form>
      <ul className={styles.todos} ref={containerRef}>
        {isCreating && <li>Adding a new todo...</li>}
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            ref={index === todos.length - 1 ? lastElementRef : null}
          >
            <input
              type='text'
              defaultValue={todo.title}
              data-id={todo.id}
              onKeyDown={handleUpdateTodo}
            />
            <TrashIcon
              className={styles.deleteIcon}
              data-id={todo.id}
              onClick={handleDeleteTodo}
            />
          </li>
        ))}
      </ul>

      {isLoading && <p>Loading todos...</p>}
      {error && <p>Error loading todos: {error.message}</p>}

      {isFetchingNextPage && <p>Loading more todos...</p>}
    </div>
  );
};
