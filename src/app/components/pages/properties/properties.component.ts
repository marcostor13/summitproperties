import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User } from '../../../interfaces/user.interface';




@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  isLoad: Boolean = false
  auth$: Observable<User>
  roleid: any;
  items: Observable<any[]>
  properties: any[]; 
  user: User;

  constructor(private router: Router, private api: ApiService, firestore: AngularFirestore, private store: Store<{ auth: User }>) {
    this.validateSession()
    this.getProperties()
    // this.items = firestore.collection('items').valueChanges()
  }

  ngOnInit(): void {
  }

  validateSession() {
    this.auth$ = this.store.pipe(select('auth'))
    this.auth$.subscribe((auth: any) => {
      if (!auth) {
        this.router.navigate(['/auth/login'])
      } else {
        this.user = auth;
      }
    })
  }

  getProperties(){

    this.isLoad = true
    let data = {
      service: 'getProperties',
      type: 'post',
      userid: this.user.id, 
      roleid: this.user.roleid,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('getProperties', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        this.properties = result;
      }

    },
      error => {
        this.isLoad = false
        this.api.c('Error', error)
        if (error.status == 401) {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        }
      });

  }


  goProperty(id){

    if(this.user.roleid == 1){
      this.router.navigate(['/properties', 'edit-properties', id])
    }else{
      this.router.navigate(['/properties','view-properties', id])
    }

  }


}
