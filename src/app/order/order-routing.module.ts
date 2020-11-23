import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderIndexComponent } from './order-index/order-index.component';

const routes: Routes = [{ path: 'order', component: OrderIndexComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
