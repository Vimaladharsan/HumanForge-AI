import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule, MatButtonModule, MatIconModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ]
})
export class HomeModule {}
