import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { read } from "fs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  updatePassword(userId: number, payload: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/password`, payload);
  }

  getUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  getLoans(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/loans?userId=${userId}`);
  }

  getRepayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repayments`);
  }

  getRepaymentsByLoanIds(loanIds: number[]): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/repayments`).pipe(
    map((repayments) => {
      const filtered = repayments.filter(r => loanIds.includes(Number(r.loanId)));
      console.log("✅ Filtered repayments:", filtered);
      return filtered;
    })
  );

  
}
}



