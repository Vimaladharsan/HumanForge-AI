import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HistoryComponent } from './history.component';
import { AuthGuard } from '../../guards/auth.guard';

@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
    RouterModule.forChild([{ path: '', component: HistoryComponent, canActivate: [AuthGuard] }]),
  ]
})
export class HistoryModule {}
