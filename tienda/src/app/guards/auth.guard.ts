import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteService } from '../services/cliente.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 

  constructor(
   private _clienteService:ClienteService,
    private _router:Router
    ){
  }

  canActivate():any{
   if(!this._clienteService.IsAuthenticand()){
    this._router.navigate(['/login']);
     return false ;

   }
      return true;
  }
}
  