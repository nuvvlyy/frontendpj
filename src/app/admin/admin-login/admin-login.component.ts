import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../service/api.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  username;
  password

  constructor(private api: ApiService,
              private http: HttpClient,
              private router: Router,) { }

  ngOnInit() {
    if(localStorage.getItem('user_type')=="admin"){
      return this.router.navigate(['/admin']);
    }
  }
  onSubmit(){
    let formdata = new FormData();
    formdata.append('username',this.username)
    formdata.append('password',this.password)
    this.api.login(formdata).subscribe(value => {
      // @ts-ignore
      if(value.error){
        // @ts-ignore
        console.log(value.error)
      }else{
        localStorage.clear();
        localStorage.setItem('user_type','admin')
        localStorage.setItem('username',this.username)
        this.router.navigate(['/admin']).then(() => {
          window.location.reload();
        });
      }
    })

  }

}
