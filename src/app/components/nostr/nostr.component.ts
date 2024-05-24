import { Component, OnInit } from '@angular/core';
import { Relay } from 'nostr-tools/relay';
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
  relayUrl: string = 'wss://relay.angor.io/';
  connectionStatus: string = '';
  connectButtonText: string = 'Connect to Relay';
  relay?: Relay;
  events: any[] = [];

  constructor(private nostrService: NostrService) {}

  ngOnInit() {
    const keys = this.nostrService.getKeys();
    this.publicKey = keys.publicKey;
    this.secretKeyHex = this.nostrService.getSecretKeyHex();
  }

  async connectRelay() {
    try {
      this.relay = await this.nostrService.connectToRelay(this.relayUrl);
      this.connectionStatus = `Connected to ${this.relay.url}`;
      this.connectButtonText = 'Connected';
      this.subscribeToEvents();
    } catch (error) {
      this.connectionStatus = `Failed to connect to ${this.relayUrl}`;
      this.connectButtonText = 'Connect to Relay';
    }
  }

  async publishEvent() {
    if (this.relay) {
      const event = this.nostrService.createEvent(this.content);
      await this.relay.publish(event);
      console.log('Event published:', event);
      this.events.push(event);  
    } else {
      console.error('No relay connected');
    }
  }

  subscribeToEvents() {
    if (this.relay) {
      const sub = this.relay.subscribe(
        [
          {
            kinds: [1],
            authors: [this.publicKey],
          },
        ],
        {
          onevent: (event) => {
            this.events.push(event);
            console.log('Received event:', event);
          },
          oneose: () => {
            sub.close();
          },
        }
      );
    }
  }
}
