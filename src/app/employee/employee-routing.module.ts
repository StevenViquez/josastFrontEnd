import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAllComponent } from './employee-all/employee-all.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeIndexComponent } from './employee-index/employee-index.component';
import { EmployeeShowComponent } from './employee-show/employee-show.component';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';

const routes: Routes = [
  { path: 'employee', component: EmployeeIndexComponent },
  {
    path: 'employee/all',
    component: EmployeeAllComponent,
  },
  { path: 'employee/create', component: EmployeeCreateComponent },
  { path: 'employee/:id', component: EmployeeShowComponent },
  { path: 'employee/update/:id', component: EmployeeUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
