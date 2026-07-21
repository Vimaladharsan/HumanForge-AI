import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatButtonToggleModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatSelectModule,
    RouterModule.forChild([{ path: '', component: AnalyticsComponent }]),
  ],
  exports: [AnalyticsComponent]
})
export class AnalyticsModule { }
