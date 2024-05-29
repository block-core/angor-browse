import { Component, OnInit } from '@angular/core';
import { NostrService } from '../../services/nostr.service';
import * as secp256k1 from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';

@Component({
  selector: 'app-nostr',
  templateUrl: './nostr.component.html',
  styleUrls: ['./nostr.component.css'],
})
export class NostrComponent implements OnInit {
  publicKey: string = '';
  secretKeyHex: string = '';
  eventContent: string = '';
  newRelayUrl: string = '';
  connectionStatus: string = '';
  connectButtonText: string = 'Connect to Relays';
  events: any[] = [];
  relays: any[] = [];
  nostrExtensionPublicKey: string = '';
  nostrPublicKey: string = '';
  nostrSignedEvent: any;
  nostrCipher: string | null = null;
  nostrDecrypted: string | null = null;
  isAuthenticated: boolean = false;
  accountType: string = '';
  publishedEventContent: string = '';
  metadata: any = null;

  constructor(public nostrService: NostrService) {}

  ngOnInit() {
    this.loadNostrPublicKeyFromLocalStorage();
  }

  loginWithNostrExtension() {
    this.connectNostrExtension();
  }

  async connectNostrExtension() {
    try {
      const gt = globalThis as any;
      const publicKey = await gt.nostr.getPublicKey();
      const relays = await gt.nostr.getRelays();
      const metadata = await this.nostrService.fetchMetadata(publicKey);

      this.nostrExtensionPublicKey = publicKey;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('nostrPublicKey', publicKey);
      }
      this.nostrPublicKey = publicKey;
      this.metadata = metadata;

      // Convert relays object to an array and add to the list of relays
      if (relays && typeof relays === 'object') {
        Object.keys(relays).forEach((relayUrl: string) => {
          this.nostrService.addRelay(relayUrl);
        });
      }
      this.relays = this.nostrService.relayService.relays;

      this.isAuthenticated = true;
      this.accountType = 'extension';
      this.publicKey = publicKey;
    } catch (error) {
      console.error('Failed to connect to Nostr extension:', error);
    }
  }

  generateNewAccount() {
    const keys = this.nostrService.generateNewAccount();
    this.publicKey = keys.publicKey;
    this.secretKeyHex = keys.secretKeyHex;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('nostrPublicKey', keys.publicKey);
      localStorage.setItem('nostrSecretKey', keys.secretKeyHex);
    }

    this.isAuthenticated = true;
    this.accountType = 'new';
  }

  loadNostrPublicKeyFromLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const publicKey = localStorage.getItem('nostrPublicKey');
      const secretKeyHex = localStorage.getItem('nostrSecretKey');
      if (publicKey) {
        this.publicKey = publicKey;
        this.nostrPublicKey = publicKey;
        this.isAuthenticated = true;
        this.accountType = secretKeyHex ? 'new' : 'extension';
      }
      if (secretKeyHex) {
        this.secretKeyHex = secretKeyHex;
      }
    }
  }

  async fetchAndAddPublicRelays() {
    try {
      const gt = globalThis as any;
      const relays = await gt.nostr.getRelays();
      
      // Convert relays object to an array and add to the list of relays
      if (relays && typeof relays === 'object') {
        Object.keys(relays).forEach((relayUrl: string) => {
          this.nostrService.addRelay(relayUrl);
        });
      }

      this.relays = this.nostrService.relayService.relays;
    } catch (error) {
      console.error('Failed to fetch public relays from extension:', error);
    }
  }

  async signAndPublishEvent() {
    try {
      const event = {
        content: this.eventContent,
        pubkey: this.publicKey,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [],
      };
      const signedEvent = await this.nostrSignEvent(event);
      await this.publishEvent(signedEvent);
      this.publishedEventContent = this.eventContent;
    } catch (error) {
      console.error('Error signing and publishing event:', error);
    }
  }

  async publishEvent(event: any) {
    try {
      await this.nostrService.publishEventToRelays(event);
      this.events.push(event);
    } catch (error) {
      console.error('Error publishing event:', error);
    }
  }

  async connectRelays() {
    try {
      await this.nostrService.relayService.connectToRelays();
      this.connectionStatus = `Connected to relays: ${this.nostrService.relayService.relays.map(r => r.url).join(', ')}`;
      this.connectButtonText = 'Connected';
      this.relays = this.nostrService.relayService.relays;
      this.subscribeToEvents();
    } catch (error) {
      this.connectionStatus = `Failed to connect to relays`;
      this.connectButtonText = 'Connect to Relays';
    }
  }

  subscribeToEvents() {
    this.nostrService.subscribeToEvents((event) => {
      this.events.push(event);
      console.log('Received event:', event);
    });
  }

  addRelay() {
    if (this.newRelayUrl) {
      this.nostrService.addRelay(this.newRelayUrl);
      this.newRelayUrl = '';
    }
  }

  serializeEvent(evt: any): string {
    return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
  }

  getEventHash(event: any): string {
    const utf8Encoder = new TextEncoder();
    const eventHash = sha256(utf8Encoder.encode(this.serializeEvent(event)));
    return this.bytesToHex(eventHash);
  }

  async nostrSignEvent(event: any) {
    const gt = globalThis as any;

    event.id = this.getEventHash(event);

    try {
      const signedEvent = await gt.nostr.signEvent(event);
      this.nostrSignedEvent = signedEvent;
      return signedEvent;
    } catch (err: any) {
      console.error(err);
      this.nostrSignedEvent = err.toString();
      throw err;
    }
  }

  bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
