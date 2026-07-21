import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor() {
    const savedTheme = typeof localStorage !== 'undefined' ? (localStorage.getItem(this.THEME_KEY) as Theme | null) : null;
    let initialTheme: Theme = 'dark';

    if (savedTheme === 'light' || savedTheme === 'dark') {
      initialTheme = savedTheme;
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      initialTheme = 'light';
    }

    this.themeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(initialTheme);
  }

  public get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  public isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
