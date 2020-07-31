import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadComponent } from './load.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    LoadComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule    
  ],
  exports: [
    LoadComponent
  ]
})
export class LoadModule { }
