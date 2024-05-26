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
import { ThemeColorComponent } from './components/theme-color/theme-color.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ThemeComponent } from './components/theme/theme.component';
 
@NgModule({
  declarations: [AppComponent, NostrComponent, HomeComponent, ProjectsComponent, ThemeSwitcherComponent, ThemeColorComponent, ThemeComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule,OverlayscrollbarsModule],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync()  
  ],
})
export class AppModule { }
