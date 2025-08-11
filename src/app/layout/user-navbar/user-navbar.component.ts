import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
declare var bootstrap: any;

@Component({
  selector: "app-user-navbar",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./user-navbar.component.html",
  styleUrl: "./user-navbar.component.css",
})
export class UserNavbarComponent {
  username = "John Doe";
  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(["/user/profile"]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  closeDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Manually hide the dropdown using Bootstrap's JS API
    const dropdownToggle = document.getElementById("desktopProfileDropdown");
    if (dropdownToggle) {
      const dropdown =
        bootstrap.Dropdown.getInstance(dropdownToggle) ||
        new bootstrap.Dropdown(dropdownToggle);
      dropdown.hide();
    }
  }

  collapseNavbar() {
    const navbarElement = document.getElementById("navbarSupportedContent");
    if (navbarElement?.classList.contains("show")) {
      const bsCollapse =
        bootstrap.Collapse.getInstance(navbarElement) ||
        new bootstrap.Collapse(navbarElement);
      bsCollapse.hide();
    }
  }
}
