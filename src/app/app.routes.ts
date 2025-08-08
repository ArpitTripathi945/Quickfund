import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { LoanApplicationComponent } from './user/loan-application/loan-application.component';
import { LoanHistoryComponent } from './user/loan-history/loan-history.component';
import { RepaymentComponent } from './user/repayment/repayment.component';
import { ProfileComponent } from './user/profile/profile.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LandingComponent } from './public/landing/landing.component';
import { ApprovalsComponent } from './admin/approvals/approvals.component';

export const routes: Routes = [
  {
    path: '' , component: LandingComponent,
  },
  {
    path: 'user', component: UserLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'apply-loan', component: LoanApplicationComponent },
      { path: 'history', component: LoanHistoryComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'repayment', component: RepaymentComponent }
    ]
  },
  {
    path:'admin/approval',component:ApprovalsComponent
  },
  // { path: '', redirectTo: '/user/dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
