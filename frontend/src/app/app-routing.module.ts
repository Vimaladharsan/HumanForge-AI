import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

const routes: Routes = [
  // Public marketing site: top navbar + footer.
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
      { path: 'features', loadChildren: () => import('./features/feature-list/feature-list.module').then(m => m.FeatureListModule) },
    ]
  },

  // Workspace: sidebar shell. Paths are unchanged, so existing links still resolve.
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'upload', loadChildren: () => import('./features/upload/upload.module').then(m => m.UploadModule) },
      { path: 'humanize', loadChildren: () => import('./features/humanize/humanize.module').then(m => m.HumanizeModule) },
      { path: 'review', loadChildren: () => import('./features/review/review.module').then(m => m.ReviewModule) },
      { path: 'code-analysis', loadChildren: () => import('./features/code-analysis/code-analysis.module').then(m => m.CodeAnalysisModule) },
      { path: 'resume', loadChildren: () => import('./features/resume/resume.module').then(m => m.ResumeModule) },
      { path: 'analytics', loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule) },
      { path: 'versions', loadChildren: () => import('./features/versions/versions.module').then(m => m.VersionsModule) },
      { path: 'export', loadChildren: () => import('./features/export/export.module').then(m => m.ExportModule) },
      { path: 'history', loadChildren: () => import('./features/history/history.module').then(m => m.HistoryModule) },
      { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
    ]
  },

  // Unknown URLs land on the public home page rather than a blank screen.
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
