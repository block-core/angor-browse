import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NostrComponent } from './components/nostr/nostr.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ExploreComponent } from './components/explore/explore.component';
import { MessagesComponent } from './components/messages/messages.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HelpComponent } from './components/help/help.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nostr', component: NostrComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'explore',component:ExploreComponent},
  { path: 'messages',component:MessagesComponent},
  { path: 'bookmarks',component:BookmarksComponent},
  { path: 'notifications',component:NotificationsComponent},
  { path: 'setings',component:SettingsComponent},
  { path: 'help',component:HelpComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
