import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FeatureListComponent } from './feature-list.component';

@NgModule({
  declarations: [FeatureListComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    RouterModule.forChild([{ path: '', component: FeatureListComponent }]),
  ]
})
export class FeatureListModule {}
