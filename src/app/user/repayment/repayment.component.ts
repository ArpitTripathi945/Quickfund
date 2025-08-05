import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repayment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './repayment.component.html',
  styleUrl: './repayment.component.css'
})
export class RepaymentComponent {
  form = {
    loanId: '',
    amount: null,
    method: ''
  };

  onSubmit() {
    if (this.form.loanId && this.form.amount && this.form.method) {
      console.log('Repayment Form Submitted:', this.form);
    }
  }

}
