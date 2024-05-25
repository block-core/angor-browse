import { Injectable } from '@angular/core';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { bytesToHex } from '@noble/hashes/utils';
import { SimplePool, Relay } from 'nostr-tools';

@Injectable({
  providedIn: 'root',
})
export class NostrService {
  private secretKey: Uint8Array;
  private publicKey: string;
  private pool: SimplePool;
  public relays: { url: string, connected: boolean }[];

  constructor() {
    this.secretKey = generateSecretKey();
    this.publicKey = getPublicKey(this.secretKey);
    this.pool = new SimplePool();
    this.relays = [
      { url: 'wss://relay.angor.io', connected: false },
      { url: 'wss://relay2.angor.io', connected: false }
    ];
  }

  getKeys() {
    return {
      secretKey: this.secretKey,
      publicKey: this.publicKey,
    };
  }

  getSecretKeyHex() {
    return bytesToHex(this.secretKey);
  }

  getPublicKeyHex() {
    return this.publicKey;
  }

  createEvent(content: string) {
    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content,
    };
    return finalizeEvent(eventTemplate, this.secretKey);
  }

  verifyEvent(event: any) {
    return verifyEvent(event);
  }

  async connectToRelays() {
    const connections = this.relays.map(async (relay) => {
      try {
        await Relay.connect(relay.url);
        relay.connected = true;
      } catch {
        relay.connected = false;
      }
    });
    await Promise.all(connections);
    console.log(`Connected to relays: ${this.relays.map(r => r.url).join(', ')}`);
  }

  async fetchMetadata(pubkey: string) {
    await this.connectToRelays();
    return new Promise((resolve, reject) => {
      const sub = this.pool.subscribeMany(
        this.relays.map(r => r.url),
        [
          {
            authors: [pubkey],
            kinds: [0],
          }
        ],
        {
          onevent(event) {
            if (event.pubkey === pubkey && event.kind === 0) {
              resolve(JSON.parse(event.content));
              sub.close();
            }
          },
          oneose() {
            sub.close();
            reject(new Error('End of stream'));
          }
        }
      );
    });
  }

  async publishEventToRelays(content: string) {
    const event = this.createEvent(content);
    await Promise.any(this.pool.publish(this.relays.map(r => r.url), event));
    console.log('Event published:', event);
    return event;
  }

  subscribeToEvents(callback: (event: any) => void) {
    this.pool.subscribeMany(
      this.relays.map(r => r.url),
      [
        {
          kinds: [1],
          authors: [this.publicKey],
        },
      ],
      {
        onevent: (event) => {
          callback(event);
        }
      }
    );
  }

  addRelay(url: string) {
    this.relays.push({ url, connected: false });
  }
}
