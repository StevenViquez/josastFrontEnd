import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from 'src/app/share/cart.service';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-order-all',
  templateUrl: './order-all.component.html',
  styleUrls: ['./order-all.component.css']
})
export class OrderAllComponent implements OnInit {

  datos: any;
  estados: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  infoVideojuego: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private notificacion: NotificacionService,
  ) { }

  ngOnInit(): void {
    this.listProducts();
    this.getstatus();
  }

  listProducts() {
    this.gService
      .list('order/all')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);

        data.forEach(function (value) {
          //console.log(value.statuses[0].pivot);
          //En lugar de tener el array de status, retorno el ultimo status ID que la orden tuvo, de esa manaera
          //puedo mapearlo en el dropdown menu.
          value.statuses.forEach(function (item, index) {
            console.log(item.pivot, index);
            value.statuses = parseInt(item.pivot.status_id);//Aca reasigno un in en la respuesta del API
          });
          //value.statuses.forEach(function (value) {
          // console.log(value);
          // });
        });
        console.log(data);
        this.datos = data;
      });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
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

  getstatus() {
    this.gService
      .list('status')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.estados = data;
      });
  }
  //Se cambia el estado de la orden, se recibe el ID de la orden y el ID del status seleccionado en el dropdown
  onOptionsSelected(e, id) {
    this.gService
      .create('order/change-status', [parseInt(e.target.value), id])
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.notificacion.mensaje(
          'Orden',
          'El estado de la orden ' + id + ' ha sido cambiado satisfactoriamente',
          'success'
        );




      });
    this.Invoice(id);
  }

  Invoice(orderId) {
    var e = <HTMLSelectElement>document.getElementById("mydrop");
    console.log("Entro aca!");
    //if (e.options[e.selectedIndex].text != 'Pendiente') {
    //  return null;
    // }

    //return true;

    this.gService
      .create('bill', orderId)
      .subscribe((respuesta: any) => {
        console.log(respuesta);
        this.notificacion.mensaje(
          'Orden',
          'Factura creada!',
          'success'
        );
        this.factura(respuesta[1]);//Para redireccionar a la factura y hacer el insert
      });

  }
//Para redireccionar a la factura y hacer el insert
  factura(id: number) {
    this.router.navigate(['../', id], {
      relativeTo: this.route,
    });
  }

}
