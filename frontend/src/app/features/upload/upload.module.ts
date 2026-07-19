import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatCardModule,
    RouterModule.forChild([{ path: '', component: UploadComponent }]),
  ],
  exports: [UploadComponent]
})
export class UploadModule { }
