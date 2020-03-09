import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fb-callback',
  templateUrl: './fb-callback.component.html',
  styleUrls: ['./fb-callback.component.scss']
})
export class FbCallbackComponent implements OnInit {


  constructor(private api: ApiService,
    private router: Router, ) { }

  ngOnInit() {
    let email = localStorage.getItem('email');
    console.log(email);
    localStorage.getItem('user_type') === 'fb_user' ? this.checkFBEmail(email) ? this.router.navigate(['/home']).then(() => { window.location.reload();}) : this.router.navigate(['/home']) : this.checkEmail(email) ? this.router.navigate(['/home']).then(() => { window.location.reload();}) : this.router.navigate(['/settings/edit-profile']);

  }

  checkEmail(email: string) {
    let params = new HttpParams();
    params = params.append('email', email);
    this.api.getUser(params).subscribe(
      data => {
        // @ts-ignore
        if (data.result.count > 0) {

          return true
        }
      },
      error => {
        console.log(error)
      }

    );

    return false;
  }

  checkFBEmail(email: string) {
    console.log('check email')
    let params = new HttpParams();
    params = params.append('email', email);
    this.api.getFbUser(params).subscribe(
      data => {
        console.log(data);
        // @ts-ignore
        if (data.result.count > 0) {
            // @ts-ignore
          localStorage.setItem('uid',data.result.results[0].id)
          return true
        } else {
          this.addUser(
            localStorage.getItem('first_name'),
            localStorage.getItem('last_name'),
            localStorage.getItem('email'),
            localStorage.getItem('dob'))
        }
      },
      error => {
        console.log(error)
      }

    );


    return false;
  }

  addUser(first_name, last_name, email, dob) {
    console.log('add user')
    const formData = new FormData()
    formData.append('first_name', first_name)
    formData.append('last_name', last_name)
    formData.append('email', email)
    formData.append('dob', this.parse(dob))
    this.api.postfbUser(formData).subscribe(((
      data => {
        console.log(data)
      }
    )));


  }
  parse(value: any) {
    if ((typeof value === 'string') && (value.includes('/'))) {
      const str = value.split('/');

      const year = str[2];
      const month = str[1];
      const date = str[0];
      const strDate = year + '-' + month + '-' + date
      return strDate
    }
  }


}
