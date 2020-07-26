import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './../../../../services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select} from '@ngrx/store';
import { Observable } from 'rxjs';
import * as action from '../../../../reducers/auth/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  response: String = ''
  form: FormGroup
  isLoad: Boolean = false

  auth$: Observable<Object>

  constructor(private router: Router, private api: ApiService, private store: Store<{auth: Object}>) {
    this.validateSession()
    this.form = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }


  ngOnInit(): void { }

  validateSession() {
    
    this.auth$ = this.store.pipe(select('auth')) 
    this.auth$.subscribe((auth:any)=>{ 
      if(auth){
        this.router.navigate(['/'])      
      }else{
        const authData = this.api.verifySession()
        if (authData !== false) {
          this.store.dispatch(action.login({ user: authData }))
          this.router.navigate(['/']);
        }
      }     
    }) 
  }

  onLogin() {
    this.isLoad = true
    this.response = ''

    if (!this.form.invalid) {
        let data = {
          email: this.email.value,
          password: this.password.value,
          service: 'auth/login',
          type: 'post'
        }
        this.api.api(data).subscribe((result: any) => {
          this.isLoad = false
          if (result) {    
            sessionStorage.setItem('ud', JSON.stringify(result))     
            this.store.dispatch(action.login({ user: result }))    
            this.router.navigate(['/']);
          }
        },
        error => {
          this.isLoad = false
          this.api.c('Error', error)     
          if (error.status == 401){
            this.response = 'Check your data'
          }
        });

    }
  }

  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }


}
