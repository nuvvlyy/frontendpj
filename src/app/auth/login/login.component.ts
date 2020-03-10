import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  haveAccount = false;
  isLoading = true;

  email: string;

  constructor(private api: ApiService,
              private router: Router,
              ) { }

  ngOnInit() {
    let email = localStorage.getItem('email');
    if (email !== undefined && email !== null) {
      this.router.navigate(['/home'])
    }

    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '523738721880315',
        cookie: true,
        xfbml: true,
        version: 'v5.0'
      });

      FB.AppEvents.logPageView();

    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }



  submitLogin() {

    // FB.login();
     FB.login((response) => {
      if (response.authResponse) {
        let userID = response.userID
        localStorage.setItem('user_type', 'fb_user')
        this.getUserData()
      }
      else {
        console.log('User login failed');
      }
    }, { scope: 'email,user_birthday' })

  }


  getUserData(userID?) {

     FB.api('/me', 'get', { fields: 'id,first_name,last_name,birthday,email' },
      (response) =>{
        console.log(response)
        localStorage.setItem('email', response.email);
        localStorage.setItem('first_name', response.first_name);
        localStorage.setItem('last_name', response.last_name);
        localStorage.setItem('dob', response.birthday)
         this.router.navigate(['/fb/callback']).then(() => {
          window.location.reload();
        });
      })

  }
  redirectReg(){
    this.router.navigate(['/register']);
  }

  // async submitLogin() {
  //   async () => console.log(this.getLogin());

  //   // console.log(res)
  // }






}
