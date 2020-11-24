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
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {
  product: any;
  productclassification: any;
  productbrand: any;
  imageURL: string;
  generosList: any;
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
    this.getproductbrand();
    this.getproductclassification();
    this.getVideojuego(id);
  }
  getVideojuego(id: number) {
    this.gService.get('product', id).subscribe((respuesta: any) => {
      this.product = respuesta;
      //Obtenida la información del videojuego
      //se construye el formulario
      this.reactiveForm();
    });
  }



  reactiveForm() {
    this.getGeneros();
    //Si hay información del videojuego
    if (this.product) {
      //let fecha = formatDate(
        //this.product.fechaEstrenoInicial,
        //'dd/MM/yyyy',
        //  'en-US'
     // );
      //Cargar la información del videojuego
      //en los controles que conforman el formulario
      this.formUpdate = this.fb.group({
        id: [this.product.id, [Validators.required]],
        name: [this.product.name, [Validators.required]],
        description: [this.product.description, [Validators.required]],
        cost: [
          this.product.cost,
          [Validators.required, Validators.pattern('[0-9]+')],
        ],
        is_enabled: [this.product.is_enabled, [Validators.required]],
        productclassification_id: [this.product.productclassification.id, [Validators.required]],
        productbrand_id: [this.product.productbrand.id, [Validators.required]],
        image: [''],
        product_features: this.fb.array([]),
        product_feature_id: this.fb.array([]),
      });
      // Vista previa imagen
      this.imageURL = this.product.url_picture;

    }
  }





 ngOnInit(): void {}



  getGeneros() {
    return this.gService
      .list('productfeature')
      .subscribe((respuesta: any) => {
        (this.generosList = respuesta), this.checkboxgeneros();
      });
  }



  get product_features(): FormArray {
    return this.formUpdate.get('product_features') as FormArray;
  }



  get product_feature_id(): FormArray {
    return this.formUpdate.get('product_feature_id') as FormArray;
  }





  private checkboxgeneros() {
    //Recorrer la lista de generos y especificar si esta seleccionado
    this.generosList.forEach((o) => {
      let selected = false;
      if (this.product.productfeatures.find((x) => x.id == o.id)) {
        console.log('entro aca myfriend!!!');
        console.log(this.product.productfeatures.id);
        selected = true;
      }
      const control = new FormControl(selected);
      (this.formUpdate.controls.product_features as FormArray).push(control);
      if (selected) {
        console.log('entro aca');
        //Agregar al array de id seleccionados
        (this.formUpdate.controls.product_feature_id as FormArray).push(
          new FormControl(o.id)
        );
      }
    });
  }




  onCheckChange(idCheck, event) {
    /* seleccionado */
    if (event.target.checked) {
      // agregar un nuevo control en el array de controles de los identificadores
      (this.formUpdate.controls.product_feature_id as FormArray).push(
        new FormControl(event.target.value)
      );
    } else {
      /* Deseleccionar*/
      // Buscar el elemento que se le quito la selección
      let i = 0;

      this.product_feature_id.controls.forEach((ctrl: FormControl) => {
        if (idCheck == ctrl.value) {
          // Quitar el elemento deseleccionado del array
          (this.formUpdate.controls.product_feature_id as FormArray).removeAt(i);
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
      this.formUpdate.get('image').setValue(file);
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
    formData = this.gService.toFormData(this.formUpdate.value);
    formData.append('_method', 'PATCH');
    this.gService
      .update_formdata('product', formData)
      .subscribe((respuesta: any) => {
        this.product = respuesta;
        this.router.navigate(['/product/all'], {
          queryParams: { update: 'true' },
        });
      });
  }
  onReset() {
    this.formUpdate.reset();
  }
  onBack() {
    this.router.navigate(['/product/all']);
  }
  public errorHandling = (control: string, error: string) => {
    return (
      this.formUpdate.controls[control].hasError(error) &&
      this.formUpdate.controls[control].invalid &&
      (this.makeSubmit || this.formUpdate.controls[control].touched)
    );
  };

  getproductclassification() {
    this.gService
      .list('product-classification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productclassification = data;
        console.log(this.productclassification)
      });
  }

  getproductbrand() {
    this.gService
      .list('product-brand')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.productbrand = data;
        console.log(this.productbrand);
      });
  }


}

