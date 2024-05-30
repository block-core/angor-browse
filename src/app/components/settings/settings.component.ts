import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NostrService } from '../../services/nostr.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('addRelayModal') addRelayModal!: TemplateRef<any>;

  relays: any[] = [];
  newRelayUrl: string = '';
  connectionStatus: string = '';
  connectButtonText: string = 'Refresh Relays';

  constructor(private nostrService: NostrService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRelays();
  }

  loadRelays() {
    this.relays = this.nostrService.relayService.relays;
  }

  openAddRelayModal() {
    this.dialog.open(this.addRelayModal);
  }

  addRelay() {
    if (this.newRelayUrl) {
      this.nostrService.addRelay(this.newRelayUrl);
      this.newRelayUrl = '';
      this.dialog.closeAll();
    }
  }

  toggleRelayStatus(relay: any) {
    relay.connected = !relay.connected;
    this.nostrService.relayService.saveRelaysToLocalStorage();
  }

  async connectRelays() {
    try {
      await this.nostrService.relayService.connectToRelays();
      this.connectionStatus = `Connected to relays: ${this.nostrService.relayService.relays.map(r => r.url).join(', ')}`;
      this.connectButtonText = 'Connected';
    } catch (error) {
      this.connectionStatus = 'Failed to connect to relays';
      this.connectButtonText = 'Connect to Relays';
    }
  }
}
