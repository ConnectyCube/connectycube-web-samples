import {Component, OnInit} from '@angular/core';
import {Output, EventEmitter} from '@angular/core';
import {userAuthorization} from "../../services/auth-service";
import {callServices} from "../../services/call-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() JoinBtnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  private CREDENTIALS = {
    appId: 5574,
    authKey: "TZU3fqTqdJPzhDB",
    authSecret: "hacNUHLEbOtXHYJ",
  };

  ngOnInit(): void {
    userAuthorization.init(this.CREDENTIALS);
  }

  public joinToGuestRoom() {
    const userName = prompt("Input user name", "User");

    if (userName) {
      userAuthorization.auth(userName, this.JoinBtnClick).then((userId) => {
        callServices.createMeeting(userId);
      })
    }
  }
}
