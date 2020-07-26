import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularFireStorageModule,
  ],
  providers: [
    { provide: BUCKET, useValue: 'summit-properties-87d18' }
  ],
})
export class HomeModule { }
