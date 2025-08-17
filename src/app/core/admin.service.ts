import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/loans`);
  }

  getAllRepayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repayments`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
}
