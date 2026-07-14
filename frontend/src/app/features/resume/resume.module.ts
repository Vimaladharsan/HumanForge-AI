import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ResumeComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [ResumeComponent]
})
export class ResumeModule { }
