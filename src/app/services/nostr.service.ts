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
  public relays: string[];

  constructor() {
    this.secretKey = generateSecretKey();
    this.publicKey = getPublicKey(this.secretKey);
    this.pool = new SimplePool();
    this.relays = [
      'wss://relay.angor.io',
      'wss://relay2.angor.io'
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
    const connectedRelays = await Promise.all(this.relays.map(url => Relay.connect(url)));
    console.log(`Connected to relays: ${this.relays.join(', ')}`);
    return connectedRelays;
  }

  async fetchMetadata(pubkey: string) {
    const relays = await this.connectToRelays();
    return new Promise((resolve, reject) => {
      const sub = this.pool.subscribeMany(
        this.relays,
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
    const publishedToAtLeastOne = await Promise.any(this.pool.publish(this.relays, event));
    console.log('Event published:', event);
    return event;
  }

  subscribeToEvents(callback: (event: any) => void) {
    const sub = this.pool.subscribeMany(
      this.relays,
      [
        {
          kinds: [1],
          authors: [this.publicKey],
        },
      ],
      {
        onevent: (event) => {
          callback(event);
        },
        oneose: () => {
          sub.close();
        },
      }
    );
  }
}
