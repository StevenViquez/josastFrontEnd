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
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent implements OnInit {

  employee: any;
  employeeposition: any;
  vehicle: any;
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
    this.getvehicle();
    this.getemployeeposition();
    this.getVideojuego(id);
  }
  getVideojuego(id: number) {
    this.gService.get('employee', id).subscribe((respuesta: any) => {
      this.employee = respuesta;
      //Obtenida la información del videojuego
      //se construye el formulario
      this.reactiveForm();
    });
  }



  reactiveForm() {
    //Si hay información del videojuego
    if (this.employee) {
      //let hired_date = formatDate(
        //this.product.hired_date,
        //'dd/MM/yyyy',
        //  'en-US'
     // );
      //Cargar la información del videojuego
      //en los controles que conforman el formulario
      this.formUpdate = this.fb.group({
        id: [this.employee.id, [Validators.required]],
        name: [this.employee.name, [Validators.required]],
        second_name: [this.employee.second_name, [Validators.required]],
        email: [this.employee.email, [Validators.required]],
        phone_number: [this.employee.phone_number, [Validators.required]],
        salary: [
          this.employee.salary,
          [Validators.required, Validators.pattern('[0-9]+')],
        ],
        hired_date: [this.employee.hired_date, [Validators.required]],
        is_enabled: [this.employee.is_enabled, [Validators.required]],
        vehicle_id: [this.employee.vehicle.id, [Validators.required]],
        employeeposition_id: [this.employee.employeeposition.id, [Validators.required]],
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
      .update_formdata('employee', formData)
      .subscribe((respuesta: any) => {
        this.employee = respuesta;
        this.router.navigate(['/employee/all'], {
          queryParams: { update: 'true' },
        });
      });
  }
  onReset() {
    this.formUpdate.reset();
  }
  onBack() {
    this.router.navigate(['/employee/all']);
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.formUpdate.controls[control].hasError(error) &&
      this.formUpdate.controls[control].invalid &&
      (this.makeSubmit || this.formUpdate.controls[control].touched)
    );
  };

  getvehicle() {
    this.gService
      .list('vehicle')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.vehicle = data;
        console.log(this.vehicle)
      });
  }

  getemployeeposition() {
    this.gService
      .list('employee-position')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.employeeposition = data;
        console.log(this.employeeposition);
      });
  }

}
