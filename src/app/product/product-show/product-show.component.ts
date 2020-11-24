import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-product-show',
  templateUrl: './product-show.component.html',
  styleUrls: ['./product-show.component.css']
})
export class ProductShowComponent implements OnInit {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  infoVideojuego: any;
  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private notificacion: NotificacionService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    //Obtener el id del videojuego
    let id = +this.route.snapshot.paramMap.get('id');
    //Obtener el videojuego
    this.getProduct(id);
  }
  getProduct(id: any) {
    this.gService
      .get('product', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // console.log(data);
        this.datos = data;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
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

