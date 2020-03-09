import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
  }
  logOut(){
    localStorage.clear();
    this.router.navigate(['/admin/login']).then(() => {
      window.location.reload();
    });
  }

}
