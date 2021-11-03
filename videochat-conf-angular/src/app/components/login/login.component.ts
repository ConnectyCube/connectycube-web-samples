import {Component} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {Store} from "@ngrx/store";
import {State} from "../../reducers";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {addUser} from "../../reducers/participant.actions";
import {appConfig, CREDENTIALS} from "../../services/config";
import {User} from "../../reducers/participant.reducer";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output() JoinBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private location: Location,
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
  ) {
  }

  public CreateAndJoinToGuestRoom() {
    const userName = prompt("Input user name", "User");

    if (userName) {
      this.authService.init(CREDENTIALS, appConfig).then(() => {
        this.callService.init();

        this.authService.auth(userName, this.JoinBtnClick).then((userId) => {
          const user: User = {id: userId, name: userName};

          this.callService.createMeetingAndJoin(user).then((roomUrl: string) => {
            this.location.replaceState("/join/" + roomUrl);
          })
        })
      })
    }
  }
}
