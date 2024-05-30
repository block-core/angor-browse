import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NostrComponent } from './components/nostr/nostr.component';
import { HomeComponent } from './components/home/home.component';
import { NostrService } from './services/nostr.service';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ThemeComponent } from './components/theme/theme.component';
import { ThemeSwitcherComponent } from './components/theme/theme-switcher/theme-switcher.component';
import { ThemeColorComponent } from './components/theme/theme-color/theme-color.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HelpComponent } from './components/help/help.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
 
@NgModule({
  declarations: [
    AppComponent,
    NostrComponent,
    HomeComponent,
    ThemeSwitcherComponent,
    ThemeColorComponent,
    ThemeComponent,
    SettingsComponent,
    HelpComponent,
    NotificationsComponent,
    BookmarksComponent,
    MessagesComponent,
    ExploreComponent,
    ProjectDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OverlayscrollbarsModule,
  ],
  bootstrap: [AppComponent],
  providers: [provideHttpClient(withFetch()), provideAnimationsAsync()],
})
export class AppModule { }
