import {
  CreateTodoVariables,
  useCreateTodo,
} from '@/hooks/todos/useCreateTodo';
import { useGetTodos } from '@/hooks/todos/useGetTodos';
import React, { FormEvent, MouseEvent, KeyboardEvent, useState } from 'react';
import { useDeleteTodo } from '@/hooks/todos/useDeleteTodo';
import TrashIcon from '@/assets/svg/icon-trash.svg';
import styles from './Todos.module.scss';
import {
  UpdateTodoVariables,
  useUpdateTodo,
} from '@/hooks/todos/useUpdateTodo';

export const Todos: React.FC = () => {
  const { todos, isFetching, queryKey } = useGetTodos({
    order: 'desc',
  });

  const [newTodoText, setNewTodoText] = useState('');

  const { createTodo } = useCreateTodo();
  const { deleteTodo } = useDeleteTodo();
  const { updateTodo } = useUpdateTodo();

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
      <ul className={styles.todos}>
        {isFetching && <li>Data is Fetching...</li>}
        {todos.map((todo) => (
          <li key={todo.id}>
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
    </div>
  );
};
