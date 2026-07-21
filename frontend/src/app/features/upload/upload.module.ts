import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatCardModule,
    MatProgressSpinnerModule, MatTooltipModule,
    RouterModule.forChild([{ path: '', component: UploadComponent }]),
  ],
  exports: [UploadComponent]
})
export class UploadModule { }
