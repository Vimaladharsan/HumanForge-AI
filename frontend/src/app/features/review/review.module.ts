import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ReviewComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [ReviewComponent]
})
export class ReviewModule { }
