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
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  product: any;
  productclassification: any;
  productbrand:any;
  imageURL: string;
  generosList: any;
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
      description: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      is_enabled: ['', [Validators.required]],
      productclassification_id:['', [Validators.required]],
      productbrand_id:['', [Validators.required]],
      product_features: this.fb.array([]),
      product_feature_id: this.fb.array([]),
      image: [''],
    });
    this.getgeneros();
    this.getproductclassification();
    this.getproductbrand();
  }


  ngOnInit(): void {}


  getgeneros() {
    return this.gService.list('productfeature').subscribe(
      (respuesta: any) => {
        (this.generosList = respuesta), this.checkboxgeneros();
      },
      (error) => {
        this.error = error;
        this.notificacion.msjValidacion(this.error);
      }
    );
  }


  get product_features(): FormArray {
    return this.formCreate.get('product_features') as FormArray;
  }
  get product_feature_id(): FormArray {
    return this.formCreate.get('product_feature_id') as FormArray;
  }
  private checkboxgeneros() {
    this.generosList.forEach(() => {
      const control = new FormControl(); // primer parámetro valor a asignar
      (this.formCreate.controls.product_features as FormArray).push(control);
    });
  }


  onCheckChange(idCheck, event) {
    /* seleccionado */
    if (event.target.checked) {
      // agregar un nuevo control en el array de controles de los identificadores
      (this.formCreate.controls.product_feature_id as FormArray).push(
        new FormControl(event.target.value)
      );
    } else {
      /* Deseleccionar*/
      // Buscar el elemento que se le quito la selección
      let i = 0;

      this.product_feature_id.controls.forEach((ctrl: FormControl) => {
        if (idCheck == ctrl.value) {
          // Quitar el elemento deseleccionado del array
          (this.formCreate.controls.product_feature_id as FormArray).removeAt(i);
          return;
        }

        i++;
      });
    }
  }



  //Obtener la imagen o archivo seleccionado
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formCreate.get('image').setValue(file);
      // Vista previa imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



  submitForm() {
    this.makeSubmit = true;

    let formData = new FormData();
    formData = this.gService.toFormData(this.formCreate.value);
    console.log(this.formCreate.value);
    formData.append('_method', 'POST');
    this.gService
      .create_formdata('product', formData)
      .subscribe((respuesta: any) => {
        this.product = respuesta;
        this.router.navigate(['/product/all'], {
          queryParams: { register: 'true' },
        });
      });
  }


  onReset() {
    this.formCreate.reset();
  }


  onBack() {
    this.router.navigate(['/product/all']);
  }


  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

  getproductclassification() {
    this.gService
      .list('product-classification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productclassification = data;
      });
  }

  getproductbrand() {
    this.gService
      .list('product-brand')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productbrand = data;
      });
  }

}

