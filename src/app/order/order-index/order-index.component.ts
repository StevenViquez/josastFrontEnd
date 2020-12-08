import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-orden-index',
  templateUrl: './order-index.component.html',
  styleUrls: ['./order-index.component.css'],
})
export class OrderIndexComponent implements OnInit {
  items: ItemCart[] = [];
  total = 0;
  tax = 0;
  billTotal = 0;
  delivery_fee = 0;
  need_delivery = 1;
  fecha = new Date();
  qtyItems = 0;
  constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.tax = this.cartService.getTax();
    this.delivery_fee = this.cartService.getDeliveryFee();
    this.billTotal = this.cartService.getBillTotal();

    this.cartService.countItems.subscribe((value) => {
      this.qtyItems = value;
    });
  }
  actualizarCantidad(item: any) {
    this.cartService.addToCart(item);
    this.total = this.cartService.getTotal();
    this.tax = this.cartService.getTax();
    this.delivery_fee = this.cartService.getDeliveryFee();
    this.billTotal = this.cartService.getBillTotal();
    this.noti.mensaje('Orden', 'Cantidad actualizada', 'success');
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total = this.cartService.getTotal();
    this.tax = this.cartService.getTax();
    this.delivery_fee = this.cartService.getDeliveryFee();
    this.billTotal = this.cartService.getBillTotal();
    this.noti.mensaje('Orden', 'Producto eliminado de la orden', 'warning');
  }
  ordenar() {
    if (this.qtyItems > 0) {
      let detalles = { detalles: this.cartService.getItems() };
      console.log(detalles);

      this.gService
        .create('order', detalles)
        .subscribe((respuesta: any) => {
          console.log(respuesta);
          /*this.noti.mensaje(
            'Orden',
            'Orden registrada satisfactoriamente',
            'success'
          );*/
          this.cartService.deleteCart();
          this.items = this.cartService.getItems();
          this.total = this.cartService.getTotal();
          this.tax = this.cartService.getTax();
          this.delivery_fee = 0;
          this.billTotal = 0;
          console.log(respuesta[1]);
          this.completeOrder(respuesta[1]);
        });
    } else {
      this.noti.mensaje('Orden', 'Agregue productos a la orden', 'warning');
    }
  }

  completeOrder(id: number) {
    this.router.navigate(['/order/complete', id], {
      relativeTo: this.route,
    });
  }

  getemployees() {
    this.gService
      .list('product-brand')
      //.pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
      //  this.productbrand = data;
      });
  }



}

