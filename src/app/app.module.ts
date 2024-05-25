import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NostrComponent } from './components/nostr/nostr.component';
import { HomeComponent } from './components/home/home.component';
import { NostrService } from './services/nostr.service';
import { ProjectsComponent } from './components/projects/projects.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, NostrComponent, HomeComponent, ProjectsComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
