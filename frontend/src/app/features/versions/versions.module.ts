import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionsComponent } from './versions.component';

@NgModule({
  declarations: [VersionsComponent],
  imports: [CommonModule],
  exports: [VersionsComponent]
})
export class VersionsModule { }
