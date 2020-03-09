import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isOpen: boolean = false
  isLogined: boolean = false
  frist_name
  isDisplayed: boolean = false
  constructor(private router: Router,) { }

  ngOnInit() {
    console.log(this.isLogined)
    this.frist_name = localStorage.getItem('first_name');
    if(localStorage.length<1 ) {

      this.isLogined = true;
    }
    this.isDisplayed = true;
  }
  openManu(){
    this.isOpen = ! this.isOpen
  }
  getIsLogined(){
    return this.isLogined
  }
  logOut(){

    localStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

}
