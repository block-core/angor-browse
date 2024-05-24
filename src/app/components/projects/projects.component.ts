import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NostrService } from '../../services/nostr.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  selectedProject: any = null;
  relayUrl: string = 'wss://relay.angor.io';

  constructor(private http: HttpClient, private nostrService: NostrService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<any[]>('/assets/projects.json').subscribe(data => {
      this.projects = data;
      this.filteredProjects = data;
    });
  }

  searchProjects(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.projectIdentifier.toLowerCase().includes(query) ||
      project.founderKey.toLowerCase().includes(query) ||
      project.trxId.toLowerCase().includes(query)
    );
  }

  selectProject(project: any) {
    this.selectedProject = project;
    this.nostrService.fetchMetadata(project.nostrPubKey, this.relayUrl).then(metadata => {
      this.selectedProject.metadata = metadata;
    }).catch(error => {
      console.error('Error fetching metadata:', error);
    });
  }
}
