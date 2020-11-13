import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeAllComponent } from './employee-all/employee-all.component';
import { EmployeeIndexComponent } from './employee-index/employee-index.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';


@NgModule({
  declarations: [EmployeeAllComponent, EmployeeIndexComponent, EmployeeShowComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
