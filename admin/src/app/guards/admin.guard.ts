import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class  AdminGuard implements CanActivate {
 

  constructor(
    private _adminService:AdminService,  
    private _router:Router
    ){
  }

  canActivate():any{
   if(!this._adminService.IsAuthenticand(['Admin'])){
    this._router.navigate(['/login']);
     return false ;

   }
      return true;
  }
}
  

