import {Component, OnInit} from '@angular/core';
import {State} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {selectMeetingIdRouterParam} from "../../reducers/route.selectors";
import {participantSelector} from "../../reducers/participant.selectors";
import {AuthService} from "../../services/auth.service";
import {CallService} from "../../services/call.service";
import {appConfig, CREDENTIALS} from "../../services/config";
import {User} from "../../reducers/participant.reducer";
import {addUser} from "../../reducers/participant.actions";

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit {
  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));
  public participantArray$ = this.store$.select(participantSelector);
  public meetId: string = '';

  constructor
  (
    private store$: Store<State>,
    private authService: AuthService,
    private callService: CallService,
  ) {
  }

  ngOnInit() {

    this.meetingId$.subscribe(event => event  ? this.meetId = event : this.meetId = '');

    const meetId = atob(this.meetId);

    if (meetId) {
      console.log("Meeting ID",this.meetId);

      this.authService.init(CREDENTIALS, appConfig).then(() => {
        this.callService.init();

        const userName = prompt("Input user name", "User");

        if (userName) {
          this.authService.auth(userName).then((userId) => {
            const user: User = {id: userId, name: userName};

            this.callService.joinUser(meetId, userId, userName);
          })
        }
      })
    }

  }

}
