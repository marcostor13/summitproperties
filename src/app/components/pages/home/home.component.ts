import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoad: Boolean = false
  auth$: Observable<Object>
  roleid: any;  
  items: Observable<any[]>
  dataUser: any;

  constructor(private router: Router, private api: ApiService, firestore: AngularFirestore, private store: Store<{ auth: Object }>) {
    this.validateSession()
    // this.items = firestore.collection('items').valueChanges()
   }

  ngOnInit(): void {
  }

  validateSession() {
    this.auth$ = this.store.pipe(select('auth'))
    this.auth$.subscribe((auth:any)=>{
      if(!auth){
        this.router.navigate(['/auth/login'])
      }else{
        this.dataUser = auth
      }
    })
  }

  // onLogin() {
  //   this.isLoad = true
  //   let data = {      
  //     service: 'auth/login',
  //     type: 'post'
  //   }
  //   this.api.api(data).subscribe((result: any) => {
  //     this.isLoad = false
  //     this.api.c('onLogin', result)
  //   },
  //   error => {
  //     this.isLoad = false
  //     this.api.c('Error', error)
  //     if (error.status == 401) {
  //       sessionStorage.setItem('ud', '')
  //       this.router.navigate(['/login']);
  //     }
  //   });

    
  // }

}
