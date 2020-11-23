import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { ProductModule } from './product/product.module';
import { EmployeeModule } from './employee/employee.module';
import { OrderModule } from './order/order.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // importar HttpClientModule después BrowserModule.
    // comunicarse con un servidor a través del protocolo HTTP
    HttpClientModule,
    // importar otras dependencias que sean necesario cargar en el componente principal.

    // importar los módulos creados propios en orden
    CoreModule,
    ShareModule,
    // después los demás módulos
    HomeModule,
    UserModule,
    ProductModule,
    EmployeeModule,
    OrderModule,
    // al final el gestor de las rutas principal
    AppRoutingModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
