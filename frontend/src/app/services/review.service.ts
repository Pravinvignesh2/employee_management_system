import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  id?: number;
  employeeId: number;
  employeeName?: string;
  reviewerId: number;
  reviewerName?: string;
  title: string;
  rating: number;
  summary: string;
  strengths?: string;
  improvements?: string;
  goals?: string;
  reviewDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  employeeId: number;
  title: string;
  rating: number;
  summary: string;
  strengths?: string;
  improvements?: string;
  goals?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) { }

  // Create a new review
  createReview(reviewData: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, reviewData);
  }

  // Get review by ID
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  // Get all reviews for a specific employee
  getReviewsByEmployee(employeeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Get all reviews by a specific reviewer
  getReviewsByReviewer(reviewerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviewer/${reviewerId}`);
  }

  // Update an existing review
  updateReview(id: number, reviewData: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, reviewData);
  }

  // Delete a review
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get reviews by employee department
  getReviewsByDepartment(department: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/department/${department}`);
  }

  // Get recent reviews
  getRecentReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/recent`);
  }
}
