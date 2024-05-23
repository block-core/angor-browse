// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: WebSocket;
  private messages!: Subject<any>;

  public connect(url: string): Subject<any> {
    if (!this.messages) {
      this.socket = new WebSocket(url);
      this.messages = new Subject<any>();

      this.socket.onmessage = (event) => this.messages.next(event.data);
      this.socket.onerror = (error) => this.messages.error(error);
      this.socket.onclose = () => this.messages.complete();
    }
    return this.messages;
  }

  public send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
