import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dialog} from "../../services/config";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {getParticipantActivity} from "../../reducers/participants/participants.selectors";
import {isToday} from "../../services/utilities";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit, OnDestroy {

  private subscribeToLastActivity: any;
  public lastActivityStatus: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog, meId: number },
              private store$: Store) {
  }

  public getLastSeen(lastActivity: number | null) {
    if (lastActivity === -1 || lastActivity === null) {
      this.lastActivityStatus = "";
    }
    else {
      if (lastActivity < 60) {
        this.lastActivityStatus = "Online";
      }
      else {
        const date = new Date(new Date().getTime() - lastActivity * 1000);
        const activity = isToday(date) ? date.toLocaleTimeString() : date.toLocaleString();
        this.lastActivityStatus = "Last seen: " + activity;
      }
    }
  }

  ngOnInit(): void {
    const userId = this.data.dialog.participantIds.find((id: number) => id !== this.data.meId);
    this.subscribeToLastActivity = this.store$.select(getParticipantActivity, {pId: userId})
      .subscribe(participantActivity => {
        this.getLastSeen(participantActivity);
      });
  }

  ngOnDestroy() {
    this.subscribeToLastActivity.unsubscribe();
  }

}
