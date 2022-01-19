import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {appConfig, CREDENTIALS} from "./services/config";
import {Store} from "@ngrx/store";
import {selectCurrentRoute, selectFragment, selectUrl} from "./reducers/router.selector";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private sub: any

  constructor(
    private router: Router,
    private authService: AuthService,
    private store$: Store
  ) {
  }

  ngOnInit() {
    const token = atob(localStorage.getItem('token') || "");

    this.sub = this.store$.select(selectUrl).subscribe(res => {
      console.warn(res);
      if (res !== undefined) {
        if (token && res !== '/auth') {
          this.authService.initSessionFromToken(token);
          res = res === '/' ? '/chat' : res;
          this.router.navigateByUrl(res);
        }
        else {
          this.router.navigateByUrl('/auth')
        }
        this.sub.unsubscribe();
      }
    })
  }

}
