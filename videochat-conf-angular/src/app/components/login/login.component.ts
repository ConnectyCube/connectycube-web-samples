import {Component, OnInit} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {AuthService} from "../../services/auth.service";
import {appConfig, CREDENTIALS} from "../../services/config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() JoinBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private store$: Store<State>,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.init(CREDENTIALS, appConfig)
  }

  public GoToPrejoin() {
    this.router.navigateByUrl("/join/prejoin");
  }
}
