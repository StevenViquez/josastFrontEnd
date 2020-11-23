import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.css']
})
export class ProductAllComponent implements OnInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  infoVideojuego: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private notificacion: NotificacionService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.listProducts();
  }
  listProducts() {
    this.gService
      .list('product/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.datos = data;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }

  createProduct() {
    this.router.navigate(['../create'], {
      relativeTo: this.route,
    });
  }

  updateProduct(id: number) {
    this.router.navigate(['../update', id], {
      relativeTo: this.route,
    });
  }

  showProduct(id: number) {
    this.router.navigate(['../', id], {
      relativeTo: this.route,
    });
  }

  agregarProducto(id: number) {
    this.gService
      .get('product', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.infoVideojuego = data;
        this.cartService.addToCart(this.infoVideojuego);
        this.notificacion.mensaje(
          'Orden',
          'Producto agregado a la orden',
          'success'
        );
      });
  }

}


