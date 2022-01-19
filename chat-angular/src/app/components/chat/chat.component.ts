import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectedConversationSelector} from "../../reducers/dialog/dialog.selectors";
import {selectDialogIdRouterParam} from "../../reducers/router.selector";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public selectedConversation$ = this.store$.select(selectDialogIdRouterParam);

  constructor(private store$: Store) {
  }


  ngOnInit(): void {
  }

}
