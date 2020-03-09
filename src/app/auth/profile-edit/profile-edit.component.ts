import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  user_type;
  uFristName;
  uLastName;
  uEmail;
  uDateOfBirth;
  constructor(private router: Router,
              private api:ApiService) { }

  ngOnInit() {
    if(!localStorage.length){
      this.router.navigate(['/login']);
    }
    else{
      this.uFristName = localStorage.getItem('first_name')
      this.uLastName = localStorage.getItem('last_name')
      this.uEmail = localStorage.getItem('email')
      this.uDateOfBirth = this.parse(localStorage.getItem('dob'))
      // this.uDateOfBirth = "2010-06-05"
      console.log(this.uDateOfBirth)
    }
    
    this.user_type = localStorage.getItem('user_type')
  }

  fbUserType(){
   if( this.user_type = 'fb_user' ) {
     return true 
  }
  return false;
}

parse(value: any): Date | null {
  if ((typeof value === 'string') && (value.includes('/'))) {
    const str = value.split('/');

    const year = Number(str[2]);
    const month = Number(str[1]) - 1;
    const date = Number(str[0]);
    
    return new Date(year, month, date)
  } else if((typeof value === 'string') && value === '') {
    return new Date();
  }
  const timestamp = typeof value === 'number' ? value : Date.parse(value);
  return isNaN(timestamp) ? null : new Date(timestamp);
}
display($event){
  console.log(event)
}


}
