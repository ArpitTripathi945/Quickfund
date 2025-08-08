import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { LoanService } from "../../core/loan.service";
import { LoanData, Repayment } from "../../modals/loan-data";

@Component({
  selector: "app-loan-history",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./loan-history.component.html",
  styleUrl: "./loan-history.component.css",
})
export class LoanHistoryComponent implements OnInit {
  loans: LoanData[] = [];
  filteredLoans: LoanData[] = [];
  searchTerm: string = "";
  statusFilter: string = "";
  expandedLoan: string | null = null;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.filteredLoans = data;
      },
      error: (error) => {
        console.error("Error loading loans:", error);
      },
    });
  }

  filterLoans(): void {
    this.filteredLoans = this.loans.filter((loan) => {
      const matchesSearch =
        !this.searchTerm ||
        loan.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.statusFilter ||
        this.getCalculatedStatus(loan) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getCalculatedStatus(loan: LoanData): string {
    const totalRepaid = this.getTotalRepaid(loan);

    if (totalRepaid >= loan.amount) {
      return "completed";
    } else if (totalRepaid > 0) {
      return "active";
    } else {
      return "pending";
    }
  }

  getTotalRepaid(loan: LoanData): number {
    return loan.repaymentHistory.reduce(
      (total, payment) => total + payment.amount,
      0
    );
  }

  toggleDetails(loanId: string): void {
    this.expandedLoan = this.expandedLoan === loanId ? null : loanId;
  }

  trackByLoanId(index: number, loan: LoanData): string {
    return loan.id;
  }
}
