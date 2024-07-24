import { computed, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Todo, ToDoState } from '../models';
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { setErrorMessage } from '../utility/errorHandling';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  #todoUrl = 'https://jsonplaceholder.typicode.com/todos';

  // Services
  private http = inject(HttpClient);
  private userService = inject(UserService);

  private state = signal<ToDoState>({
    isLoading: false,
    currentMember: undefined,
    memberToDos: [],
    incompleteOnly: false,
    error: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  currentMember = computed(() => this.state().currentMember);
  toDos = computed(() => this.state().memberToDos);
  incompleteOnly = computed(() => this.state().incompleteOnly);
  errorMessage = computed(() => this.state().error);
  filteredToDos = computed(() => {
    if (this.incompleteOnly()) {
      return this.toDos().filter((t) => t.completed === false);
    } else {
      return this.toDos();
    }
  });

  // Reducers
  // Define how actions should update state
  private selectedIdSubject = new Subject<number>();
  private selectedId$ = this.selectedIdSubject.asObservable();

  constructor() {
    this.selectedId$
      .pipe(
        // Set the loading indicator
        tap(() => this.setLoadingIndicator(true)),
        // Set the current member
        tap((id) => this.setCurrentMember(id)),
        // Get the related todos
        switchMap((id) => this.getToDos(id)),
        // To better see the loading message
        delay(1000),
        // Ensure the observables are finalized when this service is destroyed
        takeUntilDestroyed()
      )
      .subscribe((todos) => this.setMemberToDos(todos));
  }

  // Reducers
  private setLoadingIndicator(isLoading: boolean) {
    this.state.update((state) => ({
      ...state,
      isLoading,
    }));
  }

  private setCurrentMember(id: number) {
    const member = this.userService.getCurrentMember(id);
    this.state.update((state) => ({
      ...state,
      currentMember: member,
      memberToDos: [],
    }));
  }

  private getToDos(id: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.#todoUrl}?userId=${id}`).pipe(
      //Cut the lenght of the long strings
      map((data) =>
        data.map((t) =>
          t.title.length > 20
            ? { ...t, title: t.title.substring(0, 20) + '...' }
            : t
        )
      ),
      catchError((err) => this.setError(err))
    );
  }

  private setError(err: any) {
    const error = setErrorMessage(err);
    this.state.update((state) => ({
      ...state,
      error,
    }));
    return of([]);
  }

  private setMemberToDos(todos: Todo[]): void {
    this.state.update((state) => ({
      ...state,
      memberToDos: todos,
      isLoading: false,
    }));
  }

  filterToDos(filter: boolean) {
    this.state.update((state) => ({
      ...state,
      incompleteOnly: filter,
    }));
  }

  getTodosForMember(id: number) {
    this.selectedIdSubject.next(id);
  }

  changeStatus(todo: Todo, completed: boolean) {
    // Mark the todo as completed
    const updatedTasks = this.toDos().map((t) =>
      t.id === todo.id ? { ...t, completed } : t
    );
    this.state.update((state) => ({
      ...state,
      memberToDos: updatedTasks,
    }));
  }
}
