import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService } from 'src/app/share/notification.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
})
export class EmployeeCreateComponent implements OnInit {
  employee: any;
  vehicle: any;
  employeeposition:any;
  error: any;
  makeSubmit: boolean = false;
  formCreate: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: GenericService,
    private notificacion: NotificacionService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      name: ['', [Validators.required]],
      second_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      hired_date: ['', [Validators.required]],
      is_enabled: ['', [Validators.required]],
      vehicle_id:['', [Validators.required]],
      employeeposition_id:['', [Validators.required]],
    });
    this.getvehicle();
    this.getEmployeePosition();
  }


  ngOnInit(): void {}



  submitForm() {
    this.makeSubmit = true;

    let formData = new FormData();
    formData = this.gService.toFormData(this.formCreate.value);
    console.log(this.formCreate.value);
    formData.append('_method', 'POST');
    this.gService
      .create_formdata('employee', formData)
      .subscribe((respuesta: any) => {
        this.employee = respuesta;
        this.router.navigate(['/employee/all'], {
          queryParams: { register: 'true' },
        });
      });
  }


  onReset() {
    this.formCreate.reset();
  }


  onBack() {
    this.router.navigate(['/employee/all']);
  }


  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

  getvehicle() {
    this.gService
      .list('vehicle')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.vehicle = data;
      });
  }

  getEmployeePosition() {
    this.gService
      .list('employee-position')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.employeeposition = data;
      });
  }

}

