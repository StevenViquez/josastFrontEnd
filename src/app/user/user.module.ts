import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserCreateComponent, UserLoginComponent, UserIndexComponent],
  imports: [
    CommonModule, ReactiveFormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
