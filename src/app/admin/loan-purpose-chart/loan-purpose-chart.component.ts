import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { NgChartsModule } from "ng2-charts";
import { ChartConfiguration, ChartData, Plugin } from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { AdminService } from "../../core/admin.service";

@Component({
  selector: "app-loan-purpose-chart",
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: "./loan-purpose-chart.component.html",
})
export class LoanPurposeChartComponent implements OnInit {
  isBrowser = false;

  constructor(
    private adminService: AdminService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ Pie chart options
  pieChartOptions: ChartConfiguration<"pie">["options"] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        formatter: (value: number, ctx) => {
          const data = ctx.chart.data.datasets[0].data as number[];
          const total = data.reduce((sum, val) => sum + val, 0);
          return total ? ((value / total) * 100).toFixed(0) + "%" : "0%";
        },
        color: "#fff",
        font: { weight: "bold" },
      },
    },
  };

  pieChartData: ChartData<"pie", number[], string> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  // Force-cast DataLabelsPlugin
  pieChartPlugins: Plugin<"pie">[] = [
    DataLabelsPlugin as unknown as Plugin<"pie">,
  ];

  // ✅ Line chart options
  lineChartOptions: ChartConfiguration<"line">["options"] = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  lineChartData: ChartData<"line", number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Income",
        borderColor: "#3b82f6",
        backgroundColor: "rgba(255, 255, 255, 0.14)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    // ✅ Get loans for Pie chart (loan purposes distribution)
    this.adminService.getAllLoans().subscribe({
      next: (loans) => {
        const purposeGroups: Record<string, number> = {};
        loans.forEach((loan) => {
          purposeGroups[loan.purpose] =
            (purposeGroups[loan.purpose] || 0) + loan.amount;
        });

        this.pieChartData = {
          labels: Object.keys(purposeGroups),
          datasets: [
            {
              data: Object.values(purposeGroups),
              backgroundColor: [
                "#3b82f6",
                "#60eab0ff",
                "#f6b56aff",
                "#f97316",
                "#9333ea",
              ],
            },
          ],
        };
      },
      error: (err) => console.error("❌ Failed to fetch loans for chart:", err),
    });

    // ✅ Get repayments for Line chart (income trend over months)
    this.adminService.getAllRepayments().subscribe({
      next: (repayments) => {
        const monthlyIncome: Record<string, number> = {};
        repayments.forEach((r) => {
          const month = new Date(r.date).toLocaleString("default", {
            month: "short",
          });
          monthlyIncome[month] = (monthlyIncome[month] || 0) + r.amount;
        });

        this.lineChartData = {
          labels: Object.keys(monthlyIncome),
          datasets: [
            {
              data: Object.values(monthlyIncome),
              label: "Income",
              borderColor: "#3b82f6",
              backgroundColor: "rgba(255, 255, 255, 0.14)",
              fill: true,
              tension: 0.3,
            },
          ],
        };
      },
      error: (err) =>
        console.error("❌ Failed to fetch repayments for chart:", err),
    });
  }
}
