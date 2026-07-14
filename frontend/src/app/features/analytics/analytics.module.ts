import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [AnalyticsComponent]
})
export class AnalyticsModule { }
