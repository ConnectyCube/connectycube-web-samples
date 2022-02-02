import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dialog} from "../../services/config";
import {Store} from "@ngrx/store";
import {getParticipants} from "../../reducers/participants/participants.selectors";
import {Observable} from "rxjs";
import {participant} from "../../reducers/participants/participants.reducer";

@Component({
  selector: 'app-dialog-details',
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss']
})
export class DialogDetailsComponent implements OnInit {

  public dialogParticipants$: Observable<Array<participant>> = this.store$.select(getParticipants);

  constructor(
    private store$: Store,
    @Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog }
  ) {
  }

  participantsTrackBy(index: number, participant: participant) {
    return participant.id;
  }

  ngOnInit(): void {
    console.warn(this.data.dialog)
  }

}
