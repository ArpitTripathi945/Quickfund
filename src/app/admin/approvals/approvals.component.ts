import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoanApprovalService } from '../../core/loan-approval.service';
import { LoanApplication } from '../../modals/loan-application';


@Component({
  selector: "app-approvals",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./approvals.component.html",
  styleUrl: "./approvals.component.css",
})
export class ApprovalsComponent implements OnInit{
  applications: LoanApplication[] = [];
  filteredApplications: LoanApplication[] = [];
  searchTerm: string = "";
  statusFilter: string = "pending";
  applicationCounts = { pending: 0, approved: 0, rejected: 0, active: 0 };

  constructor(private loanApprovalService: LoanApprovalService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loanApprovalService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.applicationCounts =
          this.loanApprovalService.getApplicationsCount();
        this.filterApplications();
      },
      error: (error) => {
        console.error("Error loading applications:", error);
      },
    });
  }

  filterApplications(): void {
    let filtered = this.applications;

    if (this.statusFilter) {
      filtered = filtered.filter((app) => app.status === this.statusFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.customer.toLowerCase().includes(term) ||
          app.id.toLowerCase().includes(term) ||
          app.purpose.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered;
  }

  onSearchChange(): void {
    this.filterApplications();
  }

  onStatusFilterChange(): void {
    this.filterApplications();
  }

  approveApplication(applicationId: string): void {
    this.loanApprovalService.approveApplication(applicationId);
    this.loadApplications(); // reload list after approval
  }

  rejectApplication(applicationId: string): void {
    this.loanApprovalService.rejectApplication(applicationId);
    this.loadApplications(); // reload list after rejection
  }

  getRiskLevelClass(riskLevel: string): string {
    switch (riskLevel) {
      case "Low":
        return "text-success";
      case "Medium":
        return "text-warning";
      case "High":
        return "text-danger";
      default:
        return "text-muted";
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "approved":
        return "bg-success";
      case "rejected":
        return "bg-danger";
      case "active":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  }

  trackByApplicationId(index: number, application: LoanApplication): string {
    return application.id;
  }
}
