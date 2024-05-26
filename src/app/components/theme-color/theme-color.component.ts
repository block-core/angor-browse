import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './theme-color.component.html',
  styleUrls: ['./theme-color.component.css']
})
export class ThemeColorComponent implements OnInit {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private renderer: Renderer2) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadSettings();
      this.setupListeners();
    }
  }

  loadSettings() {
    let theme = this.getLocalStorageItem('theme');
    if (theme) {
      this.setTheme(theme);
    }

    let showBanner = this.getLocalStorageItem('showBanner');
    if (showBanner === null || showBanner === undefined || showBanner === 'true') {
      this.enableBanner();
    } else {
      this.disableBanner();
    }

    let hue = this.getLocalStorageItem('hue');
    if (hue) {
      this.setHue(hue);
    } else {
      this.setHue('250');
    }
  }

  setupListeners() {
    const slider = document.getElementById('colorSlider') as HTMLInputElement;
    const presetList = document.getElementById('preset-list');
    const showBannerCheck = document.querySelector("input[name=banner-checkbox]") as HTMLInputElement;
    const output = document.getElementById('hueValue');

    if (slider) {
      slider.oninput = () => {
        const hue = slider.value;
        this.setHue(hue);
        if (output) output.innerText = hue;
        slider.value = hue;
      };
    }

    if (presetList) {
      presetList.onclick = (event) => {
        const target = event.target as HTMLElement;
        const hue = target.dataset['hue'];
        if (hue) {
          this.setHue(hue);
          slider.value = hue;
        }
      };
    }

    if (showBannerCheck) {
      showBannerCheck.addEventListener('change', () => {
        if (showBannerCheck.checked) {
          this.enableBanner();
        } else {
          this.disableBanner();
        }
      });

      const r = document.documentElement;
      if (r.getAttribute('showBanner') === 'true') {
        showBannerCheck.checked = true;
      }
    }
  }

  setTheme(theme: string) {
    if (this.isBrowser) {
      document.documentElement.setAttribute('theme', theme);
      this.setLocalStorageItem('theme', theme);
    }
  }

  enableBanner() {
    if (this.isBrowser) {
      document.documentElement.setAttribute('showBanner', 'true');
      this.setLocalStorageItem('showBanner', 'true');
    }
  }

  disableBanner() {
    if (this.isBrowser) {
      document.documentElement.setAttribute('showBanner', 'false');
      this.setLocalStorageItem('showBanner', 'false');
    }
  }

  setHue(hue: string) {
    if (this.isBrowser) {
      const root = document.documentElement;
      root.style.setProperty('--primary-hue', hue);
      this.setLocalStorageItem('hue', hue);
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
}
