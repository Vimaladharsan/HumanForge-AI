import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeAnalysisComponent } from './code-analysis.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [CodeAnalysisComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [CodeAnalysisComponent]
})
export class CodeAnalysisModule { }
