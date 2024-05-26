import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NostrComponent } from './components/nostr/nostr.component';
import { HomeComponent } from './components/home/home.component';
import { NostrService } from './services/nostr.service';
import { ProjectsComponent } from './components/projects/projects.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { SettingsComponent } from './components/settings/settings.component';
 
@NgModule({
  declarations: [AppComponent, NostrComponent, HomeComponent, ProjectsComponent, ThemeSwitcherComponent, SettingsComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule,OverlayscrollbarsModule],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(withFetch())  
  ],
})
export class AppModule { }