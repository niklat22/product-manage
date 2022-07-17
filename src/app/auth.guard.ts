import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot } from '@angular/router';
import { UrlSegment } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs';
import { ProjectSettingsService } from './project-settings.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  roleAs: string;

  constructor(
    public projectService: ProjectSettingsService,
    public router: Router,
    public toastr: ToastrManager
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url, route);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string, route: ActivatedRouteSnapshot) {
    const userRole = this.projectService.getRole();
      
    if (this.projectService.isLoggedIn()) {
      if(!userRole && route.routeConfig.path == 'category'){
        this.toastr.warningToastr('Only admin can access category.', 'Alert!');
        this.router.navigate(['/dashboard']);
      }
      return true;
    } else {
      this.router.navigate(['']);
    }

    this.projectService.redirectUrl = url;
  }
}
