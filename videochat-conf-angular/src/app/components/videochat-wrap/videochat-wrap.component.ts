import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {State} from "../../reducers";
import {Store} from "@ngrx/store";
import {chatStatusSelector, controlButtonsStatusSelector} from "../../reducers/interface.selectors";
import {addControlButtonsStatus, addSwitchVideoStatus} from "../../reducers/interface.actions";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-videochat-wrap',
  templateUrl: './videochat-wrap.component.html',
  styleUrls: ['./videochat-wrap.component.scss']
})
export class VideochatWrapComponent implements OnInit {

  public showPrejoinScreen: boolean = true;
  public chatStatus$ = this.store$.select(chatStatusSelector);
  public chatStatus: boolean = false;

  constructor(private store$: Store<State>) {
  }

  public toggleControlButtons(e: any) {
    const doToggle = !e.target.closest('.chat-close-btn') && !e.target.closest('.chat-form')
    if (doToggle) {
      this.store$.select(controlButtonsStatusSelector).pipe(take(1))
        .subscribe(controlButtonsStatus => {
          if (controlButtonsStatus !== undefined) {
            controlButtonsStatus = !controlButtonsStatus;
            this.store$.dispatch(addControlButtonsStatus({controlButtonsStatus}))
          }
        })
      this.store$.dispatch(addSwitchVideoStatus({switchVideoStatus: false}));
    }
  }

  ngOnInit(): void {
    this.chatStatus$.subscribe(res => {
      if (res !== undefined) {
        this.chatStatus = res;
      }
    })
  }

}
