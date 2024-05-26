import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object ) { }
  contentHidden = false;
  elementHidden = false;
  useOverlayScrollbars = true;
  useBodyOverlayScrollbars: boolean | null = null;
  options = {
    scrollbars: {
      theme: 'os-theme-dark',
    },
  };

  @ViewChild('osRef', { read: OverlayScrollbarsComponent })
  osRef?: OverlayScrollbarsComponent;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initBodyOverlayScrollbars();
    }
  }
  title = 'angor-browse';

  initBodyOverlayScrollbars() {
    OverlayScrollbars(document.body, {
      scrollbars: {
        theme: "os-theme-light",
        clickScroll: true,
        autoHide: "leave",
        autoHideDelay: 800,
      },
    });
  }




}