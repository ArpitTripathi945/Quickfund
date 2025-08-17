import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "../../core/user.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  imports: [CommonModule, HttpClientModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  user: any;
  loans: any[] = [];
  activeLoans: any[] = [];
  repayments: any[] = [];
  recentLoan: any;
  totalRepaid = 0;
  outstandingBalance = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = typeof window !== "undefined" ? Number(localStorage.getItem("userId")) : null;
    console.log("🧠 Fetched userId from localStorage:", userId);

    if (userId) {
      this.fetchUser(userId);
      this.fetchLoans(userId);
    } else {
      console.warn("⚠️ No userId found in localStorage.");
    }
  }

  fetchUser(userId: number): void {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;
        console.log("👤 User data:", this.user);
      },
      error: (err) => console.error("❌ Failed to fetch user:", err),
    });
  }

  fetchLoans(userId: number): void {
    this.userService.getLoans(userId).subscribe({
      next: (loans) => {
        this.loans = loans;
        this.activeLoans = loans.filter((l) => l.status === "Active");
        this.recentLoan = loans[loans.length - 1];

        console.log("💳 All loans:", this.loans);
        console.log("🟢 Active loans:", this.activeLoans);
        console.log("🕑 Recent loan:", this.recentLoan);

        const loanIds = loans.map((l) => Number(l.id));
        console.log("🔍 Loan IDs to search repayments for:", loanIds);

        // ✅ Fetch repayments from service
        this.userService.getRepayments().subscribe({
          next: (repayments) => {
            console.log("📄 All repayments from server:", repayments);

            this.repayments = repayments.filter((r) =>
              loanIds.includes(Number(r.loanId)) // filter inside dashboard
            );

            console.log("✅ Matched repayments for user:", this.repayments);
            this.calculateSummary();
          },
          error: (err) => console.error("❌ Failed to fetch repayments:", err),
        });
      },
      error: (err) => console.error("❌ Failed to fetch loans:", err),
    });
  }

  calculateSummary(): void {
    this.totalRepaid = this.repayments.reduce((sum, r) => sum + r.amount, 0);
    const totalLoanAmount = this.loans.reduce((sum, l) => sum + l.amount, 0);
    this.outstandingBalance = totalLoanAmount - this.totalRepaid;

    console.log("💰 Total loan amount:", totalLoanAmount);
    console.log("💸 Total repaid:", this.totalRepaid);
    console.log("📉 Outstanding balance:", this.outstandingBalance);
  }
}
