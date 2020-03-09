import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  first_name
  last_name
  email
  username
  password
  password2
  constructor() { }

  ngOnInit() {
  }

}
