import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';
import { formatDate } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {

  order: any;
  employee: any;
  customer: any;
  formUpdate: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  makeSubmit: boolean = false;
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService,
    private notificacion: NotificacionService
  ) {
    //Desde el constructor obtener el identificar de la ruta
    const id = +this.route.snapshot.paramMap.get('id');
    this.getcustomer();
    this.getemployee();
    this.getVideojuego(id);
  }
  getVideojuego(id: number) {
    this.gService.get('order', id).subscribe((respuesta: any) => {
      this.order = respuesta;
      console.log(this.order);
       //Obtenida la información del videojuego
      //se construye el formulario
      this.reactiveForm();
    });
  }



  reactiveForm() {
    //Si hay información del videojuego
    if (this.order) {

      //Cargar la información del videojuego
      //en los controles que conforman el formulario
      this.formUpdate = this.fb.group({
        id: [this.order.id, [Validators.required]],
       need_delivery: [null, [Validators.required]],
       employee_id: [null, [Validators.required]],
       customer_id: [null, [Validators.required]],
      });
    }
  }



 ngOnInit(): void {}



  submitForm() {
    this.makeSubmit = true;

    let formData = new FormData();
    formData = this.gService.toFormData(this.formUpdate.value);
    formData.append('_method', 'PATCH');
    this.gService
      .update_formdata('order/complete-order', formData)
      .subscribe((respuesta: any) => {
        this.order = respuesta;
        this.notificacion.mensaje(
          'Orden',
          'Orden registrada satisfactoriamente',
          'success'
        );
        this.router.navigate(['/order/all'], {
          queryParams: { update: 'true' },
        });
      });
  }
  onReset() {
    this.formUpdate.reset();
  }
  onBack() {
    this.router.navigate(['/order/all']);
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.formUpdate.controls[control].hasError(error) &&
      this.formUpdate.controls[control].invalid &&
      (this.makeSubmit || this.formUpdate.controls[control].touched)
    );
  };

  getcustomer() {
    this.gService
      .list('customer')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.customer = data;
        console.log(this.customer)
      });
  }

  getemployee() {
    this.gService
      .list('employee/vendedores')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.employee = data;
        console.log(this.employee);
      });
  }

}

