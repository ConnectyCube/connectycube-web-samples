import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {chatCreatorStatusSelector} from "../../reducers/interface/interface.selectors";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public isChatCreate$ = this.store$.select(chatCreatorStatusSelector);

  constructor(private store$: Store) {
  }


  ngOnInit(): void {
  }

}
