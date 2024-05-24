import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NostrComponent } from './components/nostr/nostr.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nostr', component: NostrComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
