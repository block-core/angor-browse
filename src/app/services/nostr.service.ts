import { Injectable } from '@angular/core';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils';
import { RelayService } from './relay.service';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class NostrService {
  private secretKey: Uint8Array;
  private publicKey: string;
  public relayService: RelayService;

  constructor(relayService: RelayService, private stateService: StateService) {
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
      return Promise.reject(new Error('No connected relays'));
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
              try {
                const content = JSON.parse(event.content);
                resolve(content);
              } catch (error) {
                console.error('Error parsing event content:', error);
                resolve(null);
              }
              sub.close();
            }
          },
          oneose() {
            sub.close();
            resolve(null);
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
          },
        ],
        {
          onevent: (event: any) => {
            callback(event);
          }
        }
      );
    });
  }

  async getUsers(): Promise<User[]> {
    await this.ensureRelaysConnected(); // Ensure relays are connected before fetching users
    const pool = this.relayService.getPool();
    const connectedRelays = this.relayService.getConnectedRelays();

    if (connectedRelays.length === 0) {
      return Promise.reject(new Error('No connected relays'));
    }

    return new Promise((resolve, reject) => {
      const users: User[] = [];
      const sub = pool.subscribeMany(
        connectedRelays,
        [
          {
            kinds: [0],
          },
        ],
        {
          onevent(event) {
            try {
              const content = JSON.parse(event.content);
              const user: User = {
                nostrPubKey: event.pubkey,
                displayName: content.display_name,
                picture: content.picture,
                lastActivity: event.created_at
              };
              users.push(user);
            } catch (error) {
              console.error('Error parsing event content:', error);
            }
          },
          oneose() {
            sub.close();
            users.sort((a, b) => b.lastActivity - a.lastActivity);
            resolve(users);
          }
        }
      );
    });
  }

  subscribeToUserActivities(callback: (user: User) => void): void {
    this.ensureRelaysConnected().then(() => {
      const pool = this.relayService.getPool();
      const connectedRelays = this.relayService.getConnectedRelays();
      pool.subscribeMany(
        connectedRelays,
        [{ kinds: [1] }],
        {
          onevent: (event: any) => {
            try {
              const content = JSON.parse(event.content);
              const user: User = {
                nostrPubKey: event.pubkey,
                displayName: content.display_name,
                picture: content.picture,
                lastActivity: event.created_at
              };
              callback(user);
            } catch (error) {
              console.error('Error parsing event content:', error);
            }
          }
        }
      );
    });
  }

  addRelay(url: string): void {
    this.relayService.addRelay(url);
  }
}
