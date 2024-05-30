import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NostrService } from '../../services/nostr.service';
import { StateService } from '../../services/state.service';

interface User {
  nostrPubKey: string;
  displayName: string;
  picture: string;
  lastActivity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  users: User[] = [];
  errorMessage: string = '';
  loading: boolean = true;
  private eventSubscription: any;

  constructor(private nostrService: NostrService, private router: Router, private stateService: StateService) { }

  ngOnInit(): void {
    if (this.stateService.hasUsers()) {
      this.users = this.stateService.getUsers();
      this.loading = false;
    } else {
      this.loadUsers();
    }
    this.subscribeToUserActivities();
  }

  loadUsers(): void {
    this.nostrService.getUsers().then((users: User[]) => {
      this.users = users;
      this.stateService.setUsers(users);
      if (users.length === 0) {
        this.errorMessage = 'No users found';
      }
      this.loading = false;
    }).catch((error: any) => {
      console.error('Error fetching users:', error);
      this.errorMessage = 'Error fetching users. Please try again later.';
      this.loading = false;
    });
  }

  subscribeToUserActivities(): void {
    this.eventSubscription = this.nostrService.subscribeToUserActivities((event: any) => {
      const userIndex = this.users.findIndex(user => user.nostrPubKey === event.pubkey);
      if (userIndex !== -1) {
        this.users[userIndex].lastActivity = event.created_at;
        this.users = this.users.sort((a, b) => b.lastActivity - a.lastActivity);
        this.stateService.updateUserActivity(this.users[userIndex]);
      }
    });
  }

  goToProjectDetails(user: User): void {
    this.router.navigate(['/projects', user.nostrPubKey]);
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
