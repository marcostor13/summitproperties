import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Observable, Observer } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User } from '../../../../interfaces/user.interface';



@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  isLoad: Boolean = false
  auth$: Observable<User>
  roleid: any;
  items: Observable<any[]>
  type: String;
  id: String;
  loading = false;
  avatarUrl?: any;
  user: User;
  files: Array<any>[] = []
  images: any = []
  propertyIsSaved: Boolean = false;
  propertyInfo: any;

  list: any[] = [];
  nameItem: String = ''



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private store: Store<{ auth: User }>,
  ) {
    this.id = this.route.snapshot.paramMap.get('id')

    this.validateSession()
    // this.items = firestore.collection('items').valueChanges()
    
    this.getList()
      

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



  getList() {

    this.isLoad = true
    let data = {
      service: 'getList',
      type: 'post',
      propertyid: this.id,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('getList', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        this.list = result
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

  addItem() {
    this.isLoad = true

    if(this.nameItem != ''){

      
      let data = {
        service: 'addItem',
        type: 'post',
        propertyid: this.id,
        name: this.nameItem,
        token: this.user.token
      }
      this.api.api(data).subscribe((result: any) => {
        this.isLoad = false
        this.api.c('addItem', result)
  
        if (result.status == 'Token is Expired') {
          sessionStorage.setItem('ud', '')
          this.router.navigate(['/login']);
        } else {
          this.list.push(result)
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

  }






  deleteFile(fileid, url) {

    this.isLoad = true
    let data = {
      service: 'deleteFile',
      type: 'post',
      fileid: fileid,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('deleteFile', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
      } else {
        if (result.status) {         
          this.api.deleteProductImage(url)
        }
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


  changeList(e, id){
    this.api.c('ChangeLIst e', e.target.checked)

    this.isLoad = true
    let data = {
      service: 'updateItem',
      type: 'post',
      itemid: id,
      state: e.target.checked,
      token: this.user.token
    }
    this.api.api(data).subscribe((result: any) => {
      this.isLoad = false
      this.api.c('changeList', result)

      if (result.status == 'Token is Expired') {
        sessionStorage.setItem('ud', '')
        this.router.navigate(['/login']);
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







}

