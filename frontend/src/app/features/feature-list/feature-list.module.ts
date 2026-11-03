import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FeatureListComponent } from './feature-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [FeatureListComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule, SharedModule,
    RouterModule.forChild([{ path: '', component: FeatureListComponent }]),
  ]
})
export class FeatureListModule {}
