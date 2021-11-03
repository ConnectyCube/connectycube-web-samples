import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {State} from "./reducers";
import { selectMeetingIdRouterParam} from "./reducers/route.selectors";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  public isAuthorization = true;
  public meetingId$ = this.store$.pipe(select(selectMeetingIdRouterParam));

  constructor(private store$: Store<State>) {
  }

}
