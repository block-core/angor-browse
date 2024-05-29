import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NostrService } from '../../services/nostr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  projects: any[] = [];
  filteredProjects: any[] = [];
  selectedProject: any = null;

  constructor(private http: HttpClient, private nostrService: NostrService,private router: Router) { }

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
     this.router.navigate(['/projects', project.nostrPubKey]);
  }
}
