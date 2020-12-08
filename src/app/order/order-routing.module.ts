import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderAllComponent } from './order-all/order-all.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { OrderIndexComponent } from './order-index/order-index.component';
import { OrderShowComponent } from './order-show/order-show.component';

const routes: Routes = [
  { path: 'order', component: OrderIndexComponent },
  { path: 'order/all', component: OrderAllComponent },
  { path: 'order/:id', component: OrderShowComponent },
  { path: 'order/complete/:id', component: OrderCompleteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
