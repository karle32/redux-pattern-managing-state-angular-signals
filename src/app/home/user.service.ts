import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #userUrl = 'https://jsonplaceholder.typicode.com/users';
  private http = inject(HttpClient);

  // Read-Only Data
  members = toSignal(this.http.get<User[]>(this.#userUrl), {
    initialValue: [],
  });

  getCurrentMember(id: number): User | undefined {
    return this.members().find((member) => member.id === id);
  }
}
