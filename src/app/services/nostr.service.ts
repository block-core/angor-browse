import { Injectable } from '@angular/core';
import { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
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
    return relay;
  }
}
