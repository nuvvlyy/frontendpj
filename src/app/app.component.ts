import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stoneselectforyou';
  isAdmin = false;
  ngOnInit() {
    if (localStorage.getItem('user_type')=="admin") {
      this.isAdmin = true;
    }
  }
}
