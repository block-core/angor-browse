import { Injectable } from '@angular/core';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';
import { RelayService } from './relay.service';

@Injectable({
  providedIn: 'root',
})
export class NostrService {
  private secretKey: Uint8Array;
  private publicKey: string;
  public relayService: RelayService;

  constructor(relayService: RelayService) {
    this.secretKey = generateSecretKey();
    this.publicKey = getPublicKey(this.secretKey);
    this.relayService = relayService;
  }

  generateNewAccount(): { publicKey: string; secretKeyHex: string } {
    this.secretKey = generateSecretKey();
    this.publicKey = getPublicKey(this.secretKey);
    return {
      publicKey: this.publicKey,
      secretKeyHex: bytesToHex(this.secretKey),
    };
  }

  getKeys(): { secretKey: Uint8Array; publicKey: string } {
    return {
      secretKey: this.secretKey,
      publicKey: this.publicKey,
    };
  }

  getSecretKeyHex(): string {
    return bytesToHex(this.secretKey);
  }

  getPublicKeyHex(): string {
    return this.publicKey;
  }

  createEvent(content: string): any {
    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content,
    };
    return finalizeEvent(eventTemplate, this.secretKey);
  }

  verifyEvent(event: any): boolean {
    return verifyEvent(event);
  }

  async ensureRelaysConnected(): Promise<void> {
    await this.relayService.ensureConnectedRelays();
  }

  async fetchMetadata(pubkey: string): Promise<any> {
    await this.ensureRelaysConnected(); // Ensure relays are connected before fetching metadata
    const pool = this.relayService.getPool();
    const connectedRelays = this.relayService.getConnectedRelays();

    if (connectedRelays.length === 0) {
      throw new Error('No connected relays');
    }

    return new Promise((resolve, reject) => {
      const sub = pool.subscribeMany(
        connectedRelays,
        [
          {
            authors: [pubkey],
            kinds: [0],
          },
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
            reject(new Error('End of stream: No metadata found for the given public key.'));
          }
        }
      );
    });
  }

  async publishEventToRelays(event: any): Promise<any> {
    await this.ensureRelaysConnected();
    const pool = this.relayService.getPool();
    const connectedRelays = this.relayService.getConnectedRelays();
    try {
      await Promise.any(pool.publish(connectedRelays, event));
      console.log('Event published:', event);
      return event;
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  subscribeToEvents(callback: (event: any) => void): void {
    this.ensureRelaysConnected().then(() => {
      const pool = this.relayService.getPool();
      const connectedRelays = this.relayService.getConnectedRelays();
      pool.subscribeMany(
        connectedRelays,
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
    });
  }

  addRelay(url: string): void {
    this.relayService.addRelay(url);
  }
}
