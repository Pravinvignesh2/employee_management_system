import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button 
      class="theme-toggle" 
      (click)="toggleTheme()" 
      [attr.aria-label]="'Switch to ' + (isDarkMode ? 'light' : 'dark') + ' mode'"
      title="Toggle theme">
      <i [class]="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);
    }

    .theme-toggle:hover {
      box-shadow: var(--shadow-md);
      transform: scale(1.05);
    }

    .theme-toggle i {
      font-size: 20px;
      color: var(--text-primary);
      transition: color 0.3s ease;
    }

    @media (max-width: 768px) {
      .theme-toggle {
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
      }
      
      .theme-toggle i {
        font-size: 16px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 