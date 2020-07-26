import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHeader: Boolean = false

  @Input() dataUser: any;

  constructor(private api: ApiService) { 
    
  }

  ngOnInit(): void {
    
  }

  toogleMenu(){
    this.menuHeader = this.menuHeader ? false: true
  }

  logout(){
    this.api.logout(this.dataUser)
  }

}
