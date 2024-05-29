import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NostrService } from '../../../services/nostr.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  selectedProject: any = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private nostrService: NostrService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nostrPubKey = params.get('id');
      if (nostrPubKey) {
        this.fetchProjectMetadata(nostrPubKey);
      } else {
        this.errorMessage = 'Invalid project key. Please check the URL and try again.';
      }
    });
  }

  async fetchProjectMetadata(nostrPubKey: string): Promise<void> {
    try {
      await this.nostrService.ensureRelaysConnected(); // Ensure relays are connected before fetching metadata
      const metadata = await this.nostrService.fetchMetadata(nostrPubKey);
      this.selectedProject = metadata;
    } catch (error: any) { // Explicitly typing error as any
      console.error('Error fetching metadata:', error);
      if (error.message.includes('End of stream')) {
        this.errorMessage = 'No metadata found for the given public key. Please check the public key and try again.';
      } else {
        this.errorMessage = error.message || 'Error fetching project metadata. Please try again later.';
      }
    }
  }
}
