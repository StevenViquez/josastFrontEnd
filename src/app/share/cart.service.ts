import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export class ItemCart {
  idItem: number;
  product: any;
  cantidad: number;
  precio: number;
  subtotal: number;
  //tax: number;
  //billTotal: number;
  //delivery_fee: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<ItemCart[]>(null); //Definimos nuestro BehaviorSubject, este debe tener un valor inicial siempre
  public currentDataCart$ = this.cart.asObservable(); //Tenemos un observable con el valor actual del BehaviorSubject
  public qtyItems = new BehaviorSubject<number>(0);
  constructor() {
    //Obtener los datos
    this.cart = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('orden'))
    );
    //Establecer un observable
    this.currentDataCart$ = this.cart.asObservable();
  }
  addToCart(producto: any) {
    const newItem = new ItemCart();
    //Armar instancia de ItemCart con los valores respectivos del producto
    newItem.idItem = producto.id | producto.idItem;
    newItem.precio = producto.precio | producto.cost;
    newItem.cantidad = 1;
    newItem.subtotal = this.calculoSubtotal(newItem);
    newItem.product = producto;
    //newItem.tax = this.getTax();
    //newItem.billTotal = this.getBillTotal();
   // newItem.delivery_fee = this.getDeliveryFee();
    //Obtenemos el valor actual
    let listCart = this.cart.getValue();
    //Si no es el primer item del carrito
    if (listCart) {
      //Buscamos si ya cargamos ese item en el carrito
      let objIndex = listCart.findIndex((obj) => obj.idItem == newItem.idItem);
      //Si ya cargamos uno aumentamos su cantidad
      if (objIndex != -1) {
        if (producto.hasOwnProperty('cantidad')) {
          //Actualizar cantidad
          if (producto.cantidad <= 0) {
            this.removeFromCart(newItem);
            return;
          } else {
            listCart[objIndex].cantidad = producto.cantidad;
          }
        } else {
          //Agregar  un item
          listCart[objIndex].cantidad += 1;
        }
        newItem.cantidad = listCart[objIndex].cantidad;
        listCart[objIndex].subtotal = this.calculoSubtotal(newItem);
      }
      //Si es el primer item de ese tipo se agrega al carrito
      else {
        listCart.push(newItem);
      }
    }
    //Si es el primer elemento se inicializar
    else {
      listCart = [];
      listCart.push(newItem);
    }
    this.cart.next(listCart); //Enviamos el valor al Observable
    this.qtyItems.next(listCart.length);
    localStorage.setItem('orden', JSON.stringify(this.cart.getValue()));
  }
  private calculoSubtotal(item: ItemCart) {
    console.log(item.precio * item.cantidad);
    return item.precio * item.cantidad;
  }
  public removeFromCart(newData: ItemCart) {
    //Obtenemos el valor actual de carrito
    let listCart = this.cart.getValue();
    //Buscamos el item del carrito para eliminar
    let objIndex = listCart.findIndex((obj) => obj.idItem == newData.idItem);
    if (objIndex != -1) {
      //Eliminamos el item del array del carrito
      listCart.splice(objIndex, 1);
    }
    this.cart.next(listCart); //Enviamos el valor al Observable
    this.qtyItems.next(listCart.length);
    localStorage.setItem('orden', JSON.stringify(this.cart.getValue()));
  }

  public getItems(): any {
    return this.cart.getValue();
  }
  //Establecer booleano verificando si esta autenticado
  get countItems(): Observable<number> {
    let listCart = this.cart.getValue();
    if (listCart != null) {
      this.qtyItems.next(listCart.length);
    }
    return this.qtyItems.asObservable();
  }
  public getTotal(): number {
    let total = 0;
    let listCart = this.cart.getValue();
    if (listCart != null) {
      listCart.forEach((item: ItemCart, index) => {
        total += item.subtotal;
      });
    }
    return total;
  }

 public getTax(): number {
    return this.getTotal() * 0.13;
  }

//On this method we add TAX, Subtotal and Delivery fee.
public getBillTotal(): number {
    return this.getTotal() + this.getTax() + this.getDeliveryFee();
}
//On this method I get the total of items and compare whether it is null or not
public getDeliveryFee(): number {
    let deliveryFee = 0;
    console.log(this.cart.getValue().length);
    if (this.cart.getValue().length > 0) {
      deliveryFee = 800;
    }
    return deliveryFee;
}

  public deleteCart() {
    this.cart.next(null); //Enviamos el valor al Observable
    this.qtyItems.next(0);
    localStorage.setItem('orden', JSON.stringify(this.cart.getValue()));
  }
}
