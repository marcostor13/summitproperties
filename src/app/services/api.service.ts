import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as action from '../reducers/auth/auth.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = ''; // disponer url de su servidor que tiene las páginas PHP

  constructor(private http: HttpClient, private store: Store, private router: Router) {
    if (window.location.href.indexOf('summitproperties' ) > -1) {
      this.url = 'http://api.summitproperties.tk/api/';
    } else {
      this.url = 'http://localhost:8000/api/';
    }
  }

  api(data:any) {
    const headers = new HttpHeaders({     
      'Authorization': 'Bearer '+data.token
    })
    if(data.type == 'post'){
      return this.http.post(`${this.url + data.service}`, data, { headers: headers });
    }else if(data.type == 'get'){
      return this.http.get(`${this.url + data.service}`, { headers: headers })
    }
  }

  getRole(userid) {
    return this.api({
      service: 'getRole',
      type: 'post',
      userid: userid
    })
  }

  verifySession(){
    if (sessionStorage.getItem('ud') && sessionStorage.getItem('ud') != '') {
      const user = JSON.parse(sessionStorage.getItem('ud'))
      return {
        token: user.token.original.access_token,
        user: user.user.original 
      }
    }else{
      return false
    }
  }

  logout(data){
    this.api({
      service: 'auth/logout',
      type: 'post',     
      data: data.token
    }).subscribe((res:any)=>{
      if(res){
        sessionStorage.setItem('ud', '')
        this.store.dispatch(action.logout())
        this.router.navigate(['/auth/login'])
      }
    },
    error => {
      this.c('Error Logout', error.status)
      if (error.status== 401){
        sessionStorage.setItem('ud', '')
        this.store.dispatch(action.logout())
        this.router.navigate(['/auth/login'])
      }
    }
    )
  }

  c(title:String, message:String) {
    console.log('%c' + title + '%c=>', "background-color: purple; color:white;font-family:system-ui;font-size:10pt;font-weight:bold;padding: 4px", "background-color: white; color:purple;font-size:10pt;font-weight:bold;padding: 4px", message);
  }


}
