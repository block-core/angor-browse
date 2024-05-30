import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private users: User[] = [];

  setUsers(users: User[]): void {
    this.users = users;
  }

  getUsers(): User[] {
    return this.users;
  }

  hasUsers(): boolean {
    return this.users.length > 0;
  }

  updateUserActivity(user: User): void {
    const index = this.users.findIndex(u => u.nostrPubKey === user.nostrPubKey);
    if (index > -1) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    this.users.sort((a, b) => b.lastActivity - a.lastActivity);
  }
}
