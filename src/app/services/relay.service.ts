import { Injectable } from '@angular/core';
import { SimplePool } from 'nostr-tools';
import WebSocket from 'isomorphic-ws';

@Injectable({
  providedIn: 'root'
})
export class RelayService {
  private pool: SimplePool;
  public relays: { url: string, connected: boolean }[];
  private isConnected: boolean = false;
  private retryInterval: number = 5000; // 5 seconds

  constructor() {
    this.pool = new SimplePool();
    this.relays = [
      { url: 'wss://relay.angor.io', connected: false },
      { url: 'wss://relay2.angor.io', connected: false },
    ];
  }

  private async connectToRelay(relay: { url: any; connected: any; }): Promise<void> {
    try {
      const ws = new WebSocket(relay.url);
      ws.onopen = () => {
        relay.connected = true;
        console.log(`Connected to relay: ${relay.url}`);
      };
      ws.onerror = (error) => {
        relay.connected = false;
        console.error(`Failed to connect to relay: ${relay.url}`, error);
      };
      ws.onclose = () => {
        relay.connected = false;
        console.log(`Disconnected from relay: ${relay.url}`);
        setTimeout(() => this.connectToRelay(relay), this.retryInterval); // Retry connection after interval
      };
    } catch (error) {
      relay.connected = false;
      console.error(`Failed to connect to relay: ${relay.url}`, error);
      setTimeout(() => this.connectToRelay(relay), this.retryInterval); // Retry connection after interval
    }
  }

  public async connectToRelays(): Promise<void> {
    if (this.isConnected) return;

    const connections = this.relays.map(relay => this.connectToRelay(relay));
    await Promise.all(connections);
    this.isConnected = true;
  }

  public getPool(): SimplePool {
    return this.pool;
  }

  public getConnectedRelays(): string[] {
    return this.relays.filter(relay => relay.connected).map(relay => relay.url);
  }

  public addRelay(url: string): void {
    if (!this.relays.some((relay) => relay.url === url)) {
      this.relays.push({ url, connected: false });
      this.connectToRelay({ url, connected: false }); // Attempt to connect to the new relay
    }
  }

  public async ensureConnectedRelays(): Promise<void> {
    await this.connectToRelays();
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.getConnectedRelays().length > 0) {
          resolve();
        } else {
          setTimeout(checkConnection, 1000);
        }
      };
      checkConnection();
    });
  }
}
