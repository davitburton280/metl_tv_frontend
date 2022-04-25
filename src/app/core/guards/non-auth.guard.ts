import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot
  ) {
    if (this.auth.loggedIn()) {

      this.router.navigate([this.auth.checkRoles('admin') ? 'admin/dashboard/show' : '/']);
      return false;
    } else {
      return true;
    }
  }

}
