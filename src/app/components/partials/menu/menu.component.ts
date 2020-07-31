import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  auth$: Observable<User>

  path: String = window.location.pathname

  constructor(private store: Store<{ auth: User }>) {
    this.auth$ = this.store.pipe(select('auth'))
   }

  ngOnInit(): void {
  }

}
