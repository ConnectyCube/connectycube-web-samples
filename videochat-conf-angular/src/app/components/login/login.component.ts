import {Component, OnInit} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {appConfig, CREDENTIALS} from "../../services/config";
import {User} from "../../reducers/participant.reducer";
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
    private callService: CallService,
  ) {
  }

  ngOnInit() {
    this.authService.init(CREDENTIALS, appConfig)
  }

  public CreateAndJoinToGuestRoom() {
    const userName = prompt("Input user name", "User");

    if (userName) {
      this.callService.init();

      this.authService.auth(userName, this.JoinBtnClick).then((userId) => {
        const user: User = {id: userId, name: userName};

        this.callService.createMeetingAndJoin(user).then((roomUrl: string) => {
          this.router.navigateByUrl("/join/" + roomUrl).then(()=>{
          });
        })
      })
    }
  }
}
