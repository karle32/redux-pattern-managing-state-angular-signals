import { Component, inject } from '@angular/core';
import { UserService } from './user.service';
import { TodoService } from './todo.service';
import { Todo } from '../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  name = 'Angular';

  // Service
  userService = inject(UserService);
  todoService = inject(TodoService);

  // Signals

  users = this.userService.members;
  isLoading = this.todoService.isLoading;
  currentMember = this.todoService.currentMember;
  todosForMember = this.todoService.filteredToDos;
  errorMessage = this.todoService.errorMessage;

  // Actions
  onFilter(ele: EventTarget | null) {
    this.todoService.filterToDos((ele as HTMLInputElement).checked);
  }

  onSelected(ele: EventTarget | null) {
    this.todoService.getTodosForMember(Number((ele as HTMLInputElement).value));
  }

  onChangeStatus(task: Todo, ele: EventTarget | null) {
    this.todoService.changeStatus(task, (ele as HTMLInputElement).checked);
  }
}
