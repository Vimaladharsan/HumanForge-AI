import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
