import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  fecha = new Date();
  qtyItems = 0;
  constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();

    this.cartService.countItems.subscribe((value) => {
      this.qtyItems = value;
    });
  }
  actualizarCantidad(item: any) {
    this.cartService.addToCart(item);
    this.total = this.cartService.getTotal();
    this.noti.mensaje('Orden', 'Cantidad actualizada', 'success');
  }
  eliminarItem(item: any) {
    this.cartService.removeFromCart(item);
    this.total = this.cartService.getTotal();
    this.noti.mensaje('Orden', 'Producto eliminado de la orden', 'warning');
  }
  ordenar() {
    if (this.qtyItems > 0) {
      let detalles = { detalles: this.cartService.getItems() };
      console.log(detalles);
      this.gService
        .create('order', detalles)
        .subscribe((respuesta: any) => {
          this.noti.mensaje(
            'Orden',
            'Orden registrada satisfactoriamente',
            'sucess'
          );
          this.cartService.deleteCart();
          this.items = this.cartService.getItems();
          this.total = this.cartService.getTotal();
        });
    } else {
      this.noti.mensaje('Orden', 'Agregue productos a la orden', 'warning');
    }
  }
}

