import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, ViewChild, OnInit } from '@angular/core';
import { OverlayScrollbars } from 'overlayscrollbars';
 import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contentHidden = false;
  elementHidden = false;
  isDropdownHidden = true;
  useOverlayScrollbars = true;
  useBodyOverlayScrollbars: boolean | null = null;
  options = {
    scrollbars: {
      theme: 'os-theme-dark',
    },
  };

  @ViewChild('osRef', { read: OverlayScrollbarsComponent })
  osRef?: OverlayScrollbarsComponent;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setInitialTheme();
      this.loadSettings();
      this.initBodyOverlayScrollbars();
    }
  }

  title = 'angor-browse';

  setInitialTheme() {
    const theme = this.getLocalStorageItem('theme') || 'light';
    document.documentElement.setAttribute('theme', theme);
  }

  initBodyOverlayScrollbars() {
    const theme = this.getLocalStorageItem('theme') === 'dark' ? 'os-theme-light' : 'os-theme-dark';
    OverlayScrollbars(document.body, {
      scrollbars: {
        theme: theme,
        clickScroll: true,
        autoHide: "leave",
        autoHideDelay: 800,
      },
    });
  }

  loadSettings() {
    const theme = this.getLocalStorageItem('theme');
    if (theme) {
      this.setTheme(theme);
    }

    const showBanner = this.getLocalStorageItem('showBanner');
    if (showBanner === null || showBanner === undefined || showBanner === 'true') {
      this.enableBanner();
    } else {
      this.disableBanner();
    }

    const hue = this.getLocalStorageItem('hue');
    if (hue) {
      this.setHue(hue);
    } else {
      this.setHue('250');
    }
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('theme', theme);
    this.setLocalStorageItem('theme', theme);
    this.updateOverlayScrollbarsTheme(theme);
  }

  updateOverlayScrollbarsTheme(theme: string) {
    const osInstance = OverlayScrollbars(document.body);
    if (osInstance) {
      osInstance.options({
        scrollbars: {
          theme: theme === 'dark' ? 'os-theme-light' : 'os-theme-dark'
        }
      });
    }
  }

  enableBanner() {
    document.documentElement.setAttribute('showBanner', 'true');
    this.setLocalStorageItem('showBanner', 'true');
  }

  disableBanner() {
    document.documentElement.setAttribute('showBanner', 'false');
    this.setLocalStorageItem('showBanner', 'false');
  }

  setHue(hue: string) {
    const root = document.documentElement;
    root.style.setProperty('--primary-hue', hue);
    this.setLocalStorageItem('hue', hue);
  }

  private getLocalStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  toggleDropdown(): void {
    this.isDropdownHidden = !this.isDropdownHidden;
  }

  topFunction() {
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const btn = document.getElementById('back-to-top-btn');
    if (btn) {
      if (window.scrollY > 600) {
        btn.classList.remove('hide');
      } else {
        btn.classList.add('hide');
      }
    }
  }
}
