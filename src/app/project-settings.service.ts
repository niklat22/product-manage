import { Injectable, Injector } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../environments/environment';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  
  constructor(private httpClient: HttpClient, public router: Router, private injector: Injector, public toastr: ToastrManager){ }

  redirectUrl: string;

  login(email: string, password: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}/users/login`, {email: email, password: password})
    .pipe(map(user => {
      if (user && user.data) {
        localStorage.setItem('role', email.split('@')[0]);  
        localStorage.setItem('token', user.data);
        this.router.navigate([`/dashboard`]);
        this.toastr.successToastr('Successfully login.', 'Success!');
      }
    }),
    catchError(this.handleError.bind(this)),
    );
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      this.getProject().subscribe();
      return true;
    }
    return false;
  }

  getRole() {
     if(localStorage.getItem('role') == 'admin'){
       return true;
     }
     return false;
  }

  getCategories(): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/categories/list`, { headers: {authorization: localStorage.getItem('token')}}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  getProducts(): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/products/list`, { headers: {authorization: localStorage.getItem('token')}}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  getProject(): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/settings`).pipe(
      map((res: any) => {
        if(res.data.site_name)
          localStorage.setItem('project', res.data.site_name)
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  productAdd(data: any, tags: any[]): Observable<any>{
    data.category_id = data.category;
    data.tags = tags;
    return this.httpClient.post(`${environment.apiUrl}/products/add`,data, { headers: {authorization: localStorage.getItem('token')}}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  getEditproducts(id: any): Observable<any>{
    return this.httpClient.get(`${environment.apiUrl}/product/getEditproducts?id=${id}`, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }


  private handleError(error: HttpErrorResponse) {
    let msg = '';
    this.toastr.errorToastr('Some thing went wrong', 'Oops!');
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      msg = 'An error occurred:', error.error.message;
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      msg = 'Backend returned code ${error.status}, ` + `body was: ${error.error}'
    }
    return throwError(msg);
  }

}
