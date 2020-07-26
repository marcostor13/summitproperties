import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './../../../../services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as action from '../../../../reducers/auth/auth.actions';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  response: String = ''
  form: FormGroup
  isLoad: Boolean = false

  auth$: Observable<Object>
 

  constructor(private router: Router, private api: ApiService, private store: Store<{ auth: Object }>) {
    this.validateSession()
    this.form = this.createFormGroup();
  }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }
  

  ngOnInit(): void {}

  validateSession() {

    this.auth$ = this.store.pipe(select('auth'))
    this.auth$.subscribe((auth: any) => {
      if (auth) {
        this.router.navigate(['/'])
      } else {
        const authData = this.api.verifySession()
        if (authData !== false) {
          this.store.dispatch(action.login({ user: authData }))
          this.router.navigate(['/']);
        }
      }
    })
  }

  onRegister(){    
    this.isLoad = true
    this.response = ''
    
    if (!this.form.invalid) {

      if(this.password.value === this.repassword.value){
        let data = {
          name: this.name.value,
          email: this.email.value,
          password: this.password.value,
          password_confirmation: this.repassword.value,
          service: 'auth/register',
          type: 'post'
        }
        this.api.api(data).subscribe((result: any) => {
          this.isLoad = false
          const self = this
          if (result) {
            if (result.status == 301){
              this.response = 'User already exists'
            }else{
              this.response = 'The user already registered'
              setTimeout(function () {
                self.router.navigate(['/auth/login']);
              }, 2000)
            }

          }
        },
          error => {
            this.isLoad = false
            this.api.c('Error', error)
            if(error.error.status === 422){
              this.response = 'The user already registered'
            }

          });
      }else{
        this.response = "Passwords don't match"
      }     

    }
  }

  get name() { return this.form.get('name') }
  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }
  get repassword() { return this.form.get('repassword') }

  



}
