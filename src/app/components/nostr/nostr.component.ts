import { Component, OnInit } from '@angular/core';
import { NostrService } from '../../services/nostr.service';

@Component({
  selector: 'app-nostr',
  templateUrl: './nostr.component.html',
  styleUrls: ['./nostr.component.css'],
})
export class NostrComponent implements OnInit {
  publicKey: string = '';
  secretKeyHex: string = '';
  content: string = '';
  relayUrl: any;   
  connectionStatus: string = '';
  connectButtonText: string = 'Connect to Relays';
  events: any[] = [];

  constructor(private nostrService: NostrService) {}

  ngOnInit() {
    const keys = this.nostrService.getKeys();
    this.publicKey = keys.publicKey;
    this.secretKeyHex = this.nostrService.getSecretKeyHex();
  }

  async connectRelays() {
    try {
      await this.nostrService.connectToRelays();
      this.connectionStatus = `Connected to relays: ${this.nostrService.relays.join(', ')}`;
      this.connectButtonText = 'Connected';
      this.subscribeToEvents();
    } catch (error) {
      this.connectionStatus = `Failed to connect to relays`;
      this.connectButtonText = 'Connect to Relays';
    }
  }

  async publishEvent() {
    try {
      const event = await this.nostrService.publishEventToRelays(this.content);
      this.events.push(event);
    } catch (error) {
      console.error('Error publishing event:', error);
    }
  }

  subscribeToEvents() {
    this.nostrService.subscribeToEvents((event) => {
      this.events.push(event);
      console.log('Received event:', event);
    });
  }
}
