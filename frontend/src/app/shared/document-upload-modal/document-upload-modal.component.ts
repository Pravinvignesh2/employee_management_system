import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-document-upload-modal',
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Upload Document</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="documentForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="documentName">Document Name *</label>
            <input 
              type="text" 
              id="documentName"
              formControlName="documentName"
              placeholder="Enter document name"
              class="form-input">
            <div class="error-message" *ngIf="documentForm.get('documentName')?.invalid && documentForm.get('documentName')?.touched">
              Document name is required
            </div>
          </div>

          <div class="form-group">
            <label for="documentType">Document Type *</label>
            <select 
              id="documentType"
              formControlName="documentType"
              class="form-select">
              <option value="">Select document type</option>
              <option value="Resume">Resume</option>
              <option value="Education">Education Certificate</option>
              <option value="Training">Training Certificate</option>
              <option value="Contract">Employment Contract</option>
              <option value="ID">ID Document</option>
              <option value="Medical">Medical Certificate</option>
              <option value="Other">Other</option>
            </select>
            <div class="error-message" *ngIf="documentForm.get('documentType')?.invalid && documentForm.get('documentType')?.touched">
              Document type is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              formControlName="description"
              placeholder="Enter document description"
              rows="3"
              class="form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label for="file">File *</label>
            <div class="file-upload-area" (click)="fileInput.click()" [class.dragover]="isDragOver">
              <input 
                #fileInput
                type="file" 
                id="file"
                (change)="onFileSelected($event)"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style="display: none;">
              
              <div class="upload-content" *ngIf="!selectedFile">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="upload-text">Click to upload or drag and drop</p>
                <p class="upload-hint">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
              </div>

              <div class="selected-file" *ngIf="selectedFile">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="file-info">
                  <p class="file-name">{{ selectedFile.name }}</p>
                  <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button type="button" class="remove-file" (click)="removeFile()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="error-message" *ngIf="documentForm.get('file')?.invalid && documentForm.get('file')?.touched">
              File is required
            </div>
          </div>

          <div class="form-group">
            <label for="expiryDate">Expiry Date (if applicable)</label>
            <input 
              type="date" 
              id="expiryDate"
              formControlName="expiryDate"
              class="form-input">
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="documentForm.invalid || isSubmitting">
              <span *ngIf="!isSubmitting">Upload Document</span>
              <span *ngIf="isSubmitting">Uploading...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #111827;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .file-upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 32px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background-color: #f9fafb;
    }

    .file-upload-area:hover {
      border-color: #3b82f6;
      background-color: #f0f9ff;
    }

    .file-upload-area.dragover {
      border-color: #3b82f6;
      background-color: #f0f9ff;
    }

    .upload-content {
      color: #6b7280;
    }

    .upload-content svg {
      color: #9ca3af;
      margin-bottom: 12px;
    }

    .upload-text {
      font-weight: 500;
      margin: 8px 0 4px 0;
      color: #374151;
    }

    .upload-hint {
      font-size: 12px;
      margin: 0;
      color: #6b7280;
    }

    .selected-file {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .selected-file svg {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .file-info {
      flex: 1;
      text-align: left;
    }

    .file-name {
      font-weight: 500;
      margin: 0 0 2px 0;
      color: #111827;
    }

    .file-size {
      font-size: 12px;
      margin: 0;
      color: #6b7280;
    }

    .remove-file {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #6b7280;
      transition: all 0.2s;
    }

    .remove-file:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .error-message {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
    }
  `]
})
export class DocumentUploadModalComponent {
  @Input() isOpen: boolean = false;
  @Input() employeeId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<any>();

  documentForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  isDragOver = false;

  constructor(private fb: FormBuilder) {
    this.documentForm = this.fb.group({
      documentName: ['', Validators.required],
      documentType: ['', Validators.required],
      description: [''],
      file: [null, Validators.required],
      expiryDate: ['']
    });
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.documentForm.patchValue({ file: file });
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.documentForm.patchValue({ file: null });
  }

  onSubmit(): void {
    if (this.documentForm.valid && this.selectedFile) {
      this.isSubmitting = true;
      const documentData = {
        ...this.documentForm.value,
        employeeId: this.employeeId,
        file: this.selectedFile,
        uploadDate: new Date()
      };
      
      this.upload.emit(documentData);
      this.isSubmitting = false;
      this.resetForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private resetForm(): void {
    this.documentForm.reset();
    this.selectedFile = null;
    this.isDragOver = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.documentForm.controls).forEach(key => {
      const control = this.documentForm.get(key);
      control?.markAsTouched();
    });
  }
} 