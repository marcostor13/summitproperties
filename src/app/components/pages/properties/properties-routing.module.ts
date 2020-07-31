import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertiesComponent } from './properties.component';
import { EditPropertiesComponent } from './edit-properties/edit-properties.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { ChecklistComponent } from './checklist/checklist.component';


const routes: Routes = [

  {
    path: '',
    component: PropertiesComponent,
  },
  {
    path: 'edit-properties/:id',
    component: EditPropertiesComponent
    
  },
  {
    path: 'view-properties/:id',
    component: ViewPropertiesComponent

  },
  {
    path: 'checklist/:id',
    component: ChecklistComponent

  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule { }
