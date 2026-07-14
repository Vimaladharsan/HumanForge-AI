import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanizeComponent } from './humanize.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [HumanizeComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [HumanizeComponent]
})
export class HumanizeModule { }
