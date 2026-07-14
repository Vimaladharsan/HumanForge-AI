import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportComponent } from './export.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ExportComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [ExportComponent]
})
export class ExportModule { }
