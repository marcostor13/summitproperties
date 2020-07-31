import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesRoutingModule } from './properties-routing.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { AccountBookFill, AlertFill, AlertOutline } from '@ant-design/icons-angular/icons';
import { EditPropertiesComponent } from './edit-properties/edit-properties.component';
import { MenuModule } from '../../partials/menu/menu.module';
import { HeaderModule } from '../../partials/header/header.module';
import { PropertiesComponent } from './properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadModule } from '../../partials/load/load.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { LightboxModule } from 'primeng/lightbox';


const icons: IconDefinition[] = [AccountBookFill, AlertOutline, AlertFill];

@NgModule({
  declarations: [
    EditPropertiesComponent,
    PropertiesComponent,
    ViewPropertiesComponent,
    ChecklistComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    MenuModule,
    LoadModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzUploadModule,
    NzIconModule.forRoot(icons),
    NzMessageModule,    
    PropertiesRoutingModule,
    NzCardModule,
    LightboxModule
  ]
})
export class PropertiesModule { }
