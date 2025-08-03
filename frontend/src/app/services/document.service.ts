import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Document {
  id: number;
  name: string;
  type: string;
  description: string;
  uploadDate: Date;
  expiryDate?: Date;
  filePath?: string;
  fileSize?: number;
  userId: number;
  userName: string;
}

export interface CreateDocumentRequest {
  name: string;
  type: string;
  description: string;
  userId: number;
  expiryDate?: Date;
  filePath?: string;
  fileSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  // CRUD Operations
  createDocument(documentRequest: CreateDocumentRequest): Observable<Document> {
    return this.http.post<Document>(this.apiUrl, documentRequest);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  updateDocument(id: number, documentRequest: Partial<CreateDocumentRequest>): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, documentRequest);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get Documents
  getDocumentsByUser(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/user/${userId}`);
  }

  getDocumentsByType(type: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/type/${type}`);
  }

  getDocumentsByUserAndType(userId: number, type: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/user/${userId}/type/${type}`);
  }

  // Search Documents
  searchDocumentsByName(query: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/search?query=${query}`);
  }

  searchDocumentsByUserAndName(userId: number, query: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/user/${userId}/search?query=${query}`);
  }

  // Current User Operations
  getCurrentUserDocuments(): Observable<Document[]> {
    const currentUserId = this.getCurrentUserId();
    return this.getDocumentsByUser(currentUserId);
  }

  createDocumentForCurrentUser(documentRequest: Omit<CreateDocumentRequest, 'userId'>): Observable<Document> {
    const currentUserId = this.getCurrentUserId();
    const fullRequest: CreateDocumentRequest = {
      ...documentRequest,
      userId: currentUserId
    };
    return this.createDocument(fullRequest);
  }

  // Private helper method to get current user ID
  private getCurrentUserId(): number {
    const userStr = localStorage.getItem(environment.auth.userKey);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return 0;
  }

  // Utility Methods
  getDocumentTypeDisplay(type: string): string {
    switch (type.toLowerCase()) {
      case 'resume':
        return 'Resume';
      case 'certificate':
        return 'Certificate';
      case 'degree':
        return 'Degree';
      case 'training':
        return 'Training';
      case 'education':
        return 'Education';
      default:
        return type;
    }
  }

  getDocumentTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'resume':
        return 'primary';
      case 'certificate':
        return 'success';
      case 'degree':
        return 'info';
      case 'training':
        return 'warning';
      case 'education':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  formatDateTime(dateTime: Date | string): string {
    if (!dateTime) return '';
    const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return dateObj.toLocaleString();
  }
} 