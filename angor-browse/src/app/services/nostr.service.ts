import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoinjs from 'bitcoinjs-lib';
import { schnorr } from 'noble-secp256k1';
 
const ECPair = ECPairFactory(ecc);

@Injectable({
  providedIn: 'root'
})
export class NostrService {
  private socket!: WebSocket;
  private messages = new Subject<any>();

  constructor() { }

  connect(relayUrl: string): Observable<any> {
    this.socket = new WebSocket(relayUrl);

    this.socket.addEventListener('message', (message) => {
      const [type, subId, event] = JSON.parse(message.data);
      if (event) {
        this.messages.next(event);
      }
    });

    return this.messages.asObservable();
  }

  send(event: any): void {
    this.socket.send(JSON.stringify(["EVENT", event]));
  }

  generateKeys(): { pubKey: string, privKey: string } {
    const keypair = ECPair.makeRandom();
    const privKey = keypair.privateKey!.toString('hex');  
    let pubKey = keypair.publicKey.toString('hex');
    pubKey = pubKey.substring(2);
    return { pubKey, privKey };
  }

  async getSignedEvent(event: any, privateKey: string): Promise<any> {
    const sha256 = bitcoinjs.crypto.sha256;
    const eventData = JSON.stringify([
      0,
      event['pubkey'],
      event['created_at'],
      event['kind'],
      event['tags'],
      event['content']
    ]);
    event.id = sha256(Buffer.from(eventData)).toString('hex');  
    event.sig = await schnorr.sign(event.id, privateKey);
    return event;
  }
}
