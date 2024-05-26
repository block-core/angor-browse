import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
    }
  }

  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      let theme = this.getLocalStorageItem('theme');
      if (theme) {
        document.documentElement.setAttribute('theme', theme);
      }
      this.updateIcon();
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
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
      } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
      }
    }
  }
}
