import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {appConfig, CREDENTIALS} from "./services/config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    const token = atob(localStorage.getItem('token') || "");

    if (token) {
      this.authService.autoLogin(token);
      this.router.navigateByUrl('/chat');
    }
    else {
      this.router.navigateByUrl('/auth')
    }
  }

}
