import { User } from './users';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface ToDoState {
  isLoading: boolean;
  currentMember: User | undefined;
  memberToDos: Todo[];
  incompleteOnly: boolean;
  error: string | null;
}
