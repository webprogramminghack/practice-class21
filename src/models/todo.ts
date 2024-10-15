export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
};

export type NewTodo = Omit<Todo, 'id' | 'date'>;
