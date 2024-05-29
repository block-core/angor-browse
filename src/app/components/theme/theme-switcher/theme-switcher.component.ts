import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OverlayScrollbars } from 'overlayscrollbars';
 
@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css']
})
export class ThemeSwitcherComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      let root = document.documentElement;
      if (root.getAttribute('theme') === 'dark') {
        root.setAttribute('theme', 'light');
        this.setLocalStorageItem('theme', 'light');
      } else {
        root.setAttribute('theme', 'dark');
        this.setLocalStorageItem('theme', 'dark');
      }
      this.updateIcon();
      this.updateOverlayScrollbarsTheme();
    }
  }

  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      let theme = this.getLocalStorageItem('theme');
      if (theme) {
        document.documentElement.setAttribute('theme', theme);
      }
      this.updateIcon();
      this.updateOverlayScrollbarsTheme();
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private updateIcon() {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      const lightIcon = document.querySelector('.light-mode-icon') as HTMLElement;
      const darkIcon = document.querySelector('.dark-mode-icon') as HTMLElement;
      if (root.getAttribute('theme') === 'dark') {
        if (lightIcon) lightIcon.style.display = 'none';
        if (darkIcon) darkIcon.style.display = 'inline';
      } else {
        if (lightIcon) lightIcon.style.display = 'inline';
        if (darkIcon) darkIcon.style.display = 'none';
      }
    }
  }

  private updateOverlayScrollbarsTheme() {
    const theme = document.documentElement.getAttribute('theme');
    const osInstance = OverlayScrollbars(document.body);
    if (osInstance) {
      osInstance.options({
        scrollbars: {
          theme: theme === 'dark' ? 'os-theme-light' : 'os-theme-dark'
        }
      });
    }
  }
}
