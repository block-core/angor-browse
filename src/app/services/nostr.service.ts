import { Injectable } from '@angular/core';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { bytesToHex } from '@noble/hashes/utils';
import { Relay } from 'nostr-tools/relay';

@Injectable({
  providedIn: 'root',
})
export class NostrService {
  private secretKey: Uint8Array;
  private publicKey: string;

  constructor() {
    this.secretKey = generateSecretKey();
    this.publicKey = getPublicKey(this.secretKey);
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

  async connectToRelay(url: string) {
    const relay = await Relay.connect(url);
    console.log(`Connected to ${relay.url}`);
    return relay;
  }

  async fetchMetadata(pubkey: string, relayUrl: string) {
    const relay = await this.connectToRelay(relayUrl);
    return new Promise((resolve, reject) => {
      const sub = relay.subscribe([
        {
          authors: [pubkey],
          kinds: [0],
        }
      ], {
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
      });
    });
  }
}
