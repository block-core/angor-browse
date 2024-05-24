import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';  

import { AppComponent } from './app.component';
import { NostrComponent } from './components/nostr/nostr.component';
import { HomeComponent } from './components/home/home.component';  
import { NostrService } from './services/nostr.service';

@NgModule({
  declarations: [AppComponent, NostrComponent, HomeComponent],  
  imports: [BrowserModule, FormsModule, AppRoutingModule],  
  bootstrap: [AppComponent],
})
export class AppModule {}
