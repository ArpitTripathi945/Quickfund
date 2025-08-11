import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  activeTab = "profile";
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  matchPasswords(group: FormGroup) {
    const newPassword = group.get("newPassword")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      console.log("Password Updated:", this.passwordForm.value);
      alert("Password updated successfully!");
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
