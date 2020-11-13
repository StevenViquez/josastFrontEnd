import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAllComponent } from './employee-all/employee-all.component';
import { EmployeeIndexComponent } from './employee-index/employee-index.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';

const routes: Routes = [
  { path: 'employee', component: EmployeeIndexComponent },
  {
    path: 'employee/all',
    component: EmployeeAllComponent,
  },
  { path: 'employee/:id', component: EmployeeShowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
