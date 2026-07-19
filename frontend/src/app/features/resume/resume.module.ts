import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ResumeComponent } from './resume.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ResumeComponent],
  imports: [
    CommonModule, FormsModule, SharedModule,
    MatButtonModule, MatButtonToggleModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatProgressSpinnerModule, MatTooltipModule,
    RouterModule.forChild([{ path: '', component: ResumeComponent }]),
  ],
  exports: [ResumeComponent]
})
export class ResumeModule {}
