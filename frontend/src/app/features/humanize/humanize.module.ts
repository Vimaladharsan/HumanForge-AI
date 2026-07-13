import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanizeComponent } from './humanize.component';

@NgModule({
  declarations: [HumanizeComponent],
  imports: [CommonModule],
  exports: [HumanizeComponent]
})
export class HumanizeModule { }
