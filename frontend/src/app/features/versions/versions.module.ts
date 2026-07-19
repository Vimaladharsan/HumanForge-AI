import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VersionsComponent } from './versions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [VersionsComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatCardModule,
    RouterModule.forChild([{ path: '', component: VersionsComponent }]),
  ],
  exports: [VersionsComponent]
})
export class VersionsModule { }
