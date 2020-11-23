import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import {CartService} from 'src/app/share/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  isAutenticated: boolean;
  qtyItems = 0;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    //Subscripción a la información del usuario actual
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    //Subscripción al booleano que indica si esta autenticado
    this.authService.isAuthenticated.subscribe(
      (valor) => (this.isAutenticated = valor)
    );
    this.cartService.countItems.subscribe((value) => {
      this.qtyItems = value;
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['usuario/login']);
  }
}
