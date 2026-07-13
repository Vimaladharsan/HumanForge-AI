import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'upload', loadChildren: () => import('./features/upload/upload.module').then(m => m.UploadModule) },
  { path: 'humanize', loadChildren: () => import('./features/humanize/humanize.module').then(m => m.HumanizeModule) },
  { path: 'review', loadChildren: () => import('./features/review/review.module').then(m => m.ReviewModule) },
  { path: 'code-analysis', loadChildren: () => import('./features/code-analysis/code-analysis.module').then(m => m.CodeAnalysisModule) },
  { path: 'resume', loadChildren: () => import('./features/resume/resume.module').then(m => m.ResumeModule) },
  { path: 'analytics', loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule) },
  { path: 'versions', loadChildren: () => import('./features/versions/versions.module').then(m => m.VersionsModule) },
  { path: 'export', loadChildren: () => import('./features/export/export.module').then(m => m.ExportModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
