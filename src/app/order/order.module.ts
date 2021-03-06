import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderAllComponent } from './order-all/order-all.component';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderIndexComponent } from './order-index/order-index.component';
import { OrderShowComponent } from './order-show/order-show.component';
import { OrderUpdateComponent } from './order-update/order-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderCompleteComponent } from './order-complete/order-complete.component';


@NgModule({
  declarations: [OrderAllComponent, OrderCreateComponent, OrderIndexComponent, OrderShowComponent, OrderUpdateComponent, OrderCompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
