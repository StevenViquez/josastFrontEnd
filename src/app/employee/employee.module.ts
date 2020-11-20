import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeAllComponent } from './employee-all/employee-all.component';
import { EmployeeIndexComponent } from './employee-index/employee-index.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';


@NgModule({
  declarations: [EmployeeAllComponent, EmployeeIndexComponent, EmployeeShowComponent, EmployeeCreateComponent, EmployeeUpdateComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
