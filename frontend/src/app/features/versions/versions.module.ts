import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionsComponent } from './versions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [VersionsComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  exports: [VersionsComponent]
})
export class VersionsModule { }
