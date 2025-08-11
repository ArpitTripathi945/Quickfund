import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repayment',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './repayment.component.html',
  styleUrl: './repayment.component.css'
})
export class RepaymentComponent {
  form = {
    loanId: '',
    amount: null,
    method: ''
  };

  // Dummy data for a single user, with multiple loans and repayments
  user = {
    id: 1,
    name: 'Chethan Kumar',
    email: 'chethan@example.com',
    phone: '9876543210',
    password: 'hashedpassword1',
    monthlyIncome: 40000,
    employmentStatus: 'Employed',
    creditScore: 750,
    dateJoined: '2024-01-10',
    address: 'Bangalore, Karnataka',
    dob: '2000-05-10',
    aadharNumber: '123412341234',
    occupation: 'Software Engineer'
  };

  loans = [
    { id: 101, userId: 1, amount: 150000, purpose: 'Bike Purchase', duration: 12, status: 'Active' },
    { id: 102, userId: 1, amount: 50000, purpose: 'Medical', duration: 6, status: 'Closed' },
    { id: 106, userId: 1, amount: 120000, purpose: 'Vacation', duration: 10, status: 'Active' },
    { id: 107, userId: 1, amount: 90000, purpose: 'Home Appliances', duration: 8, status: 'Active' }
  ];

  repayments = [
    { id: 1001, loanId: 101, amount: 10000, date: '2025-06-01' },
    { id: 1002, loanId: 101, amount: 12000, date: '2025-07-01' },
    { id: 1003, loanId: 102, amount: 5000, date: '2024-09-10' },
    { id: 1004, loanId: 106, amount: 8500, date: '2025-06-05' },
    { id: 1005, loanId: 106, amount: 9200, date: '2025-07-05' },
    { id: 1006, loanId: 107, amount: 11000, date: '2025-06-10' },
    { id: 1007, loanId: 107, amount: 11500, date: '2025-07-10' }
  ];

  selectedLoan: any = null;
  selectedRepayments: any[] = [];

  onLoanChange() {
    const loanIdNum = Number(this.form.loanId);
    this.selectedLoan = this.loans.find(l => l.id === loanIdNum);
    if (this.selectedLoan) {
      this.selectedRepayments = this.repayments.filter(r => r.loanId === loanIdNum);
    } else {
      this.selectedRepayments = [];
    }
  }

  onSubmit() {
    if (this.form.loanId && this.form.amount && this.form.method) {
      console.log('Repayment Form Submitted:', this.form);
    }
  }

  get totalPaid(): number {
    if (this.selectedLoan.status.toLowerCase() === 'closed') {
      return this.selectedLoan.amount;
    }
    
    return this.selectedRepayments.reduce((sum, r) => sum + r.amount, 0);
  }

  get outstanding(): number {
    if (this.selectedLoan.status.toLowerCase() === 'closed') {
      return 0;
    }
    return this.selectedLoan ? this.selectedLoan.amount - this.totalPaid : 0;
  }
}
