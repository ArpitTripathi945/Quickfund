import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/user.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,        // ✅ for *ngIf, *ngFor, ngClass
    ReactiveFormsModule  // ✅ for [formGroup], formControlName
  ],
  standalone: true
})
export class ProfileComponent implements OnInit {
  activeTab: 'profile' | 'security' = 'profile';
  user: any;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res;
          console.log('👤 User profile loaded:', this.user);
        },
        error: (err) => {
          console.error('❌ Failed to fetch user:', err);
        }
      });
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const userId = Number(localStorage.getItem('userId'));
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.userService.updatePassword(userId, { currentPassword, newPassword }).subscribe({
        next: () => alert('✅ Password updated successfully'),
        error: (err) => alert('❌ Failed to update password: ' + err.message)
      });
    }
  }

  private passwordsMatch(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
}
