import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
 import { NostrEvent } from 'nostr-tools';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  chatUsers: User[] = [];
  messages: NostrEvent[] = [];
  selectedUser: User | null = null;
  newMessageContent: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getChatUsers().subscribe((users) => {
      this.chatUsers = users;
    });

 

    this.messageService.loadChatUsers();
    this.messageService.loadMessages();
  }

  onSelectUser(user: User): void {
    this.selectedUser = user;
    this.messageService.loadMessages().then(() => {
      this.messageService.getMessages().subscribe((messages) => {
        this.messages = messages.filter(msg => msg.pubkey === user.nostrPubKey || msg.tags.some(tag => tag[1] === user.nostrPubKey));
      });
    });
  }

  async sendMessage(): Promise<void> {
    if (this.selectedUser && this.newMessageContent.trim()) {
      await this.messageService.sendMessage(this.selectedUser.nostrPubKey, this.newMessageContent);
      this.newMessageContent = '';
    }
  }
}
