import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-dialog',
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button (click)="onClose()" class="btn-primary">OK</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .success-icon {
      margin-bottom: 1rem;
    }
    
    .success-icon i {
      font-size: 3rem;
      color: #27ae60;
    }
    
    .dialog-content h2 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }
    
    .dialog-content p {
      margin: 0 0 1.5rem 0;
      color: #7f8c8d;
      line-height: 1.5;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: center;
    }
    
    .btn-primary {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s ease;
    }
    
    .btn-primary:hover {
      background: #2980b9;
    }
    
    @media (max-width: 768px) {
      .dialog-content {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  `]
})
export class SuccessDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Success!';
  @Input() message: string = 'Operation completed successfully.';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
} 