import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private api: ApiService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.api.verifySession() !== false) {
      if (this.api.verifySession().roleid == 2) {
        return true
      } else {
        this.router.navigate(['/home-admin'])
        return false
      }
    } else {
      this.router.navigate(['/auth/login'])
      return false
    }
  }
  
}
