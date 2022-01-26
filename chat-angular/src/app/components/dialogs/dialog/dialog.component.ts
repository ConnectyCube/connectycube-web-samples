import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {selectedConversationSelector} from "../../../reducers/dialog/dialog.selectors";
import {Store} from "@ngrx/store";
import {ChatService} from "../../../services/chat.service";
import {Router} from "@angular/router";
import {getLastMessageParticipantName} from "../../../reducers/participants/participants.selectors";
import {filter, take} from "rxjs/operators";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnChanges {

  constructor(
    private store$: Store,
    private chatService: ChatService,
    private router: Router,
  ) {
  }

  public selectedConversation$ = this.store$.select(selectedConversationSelector);
  public lastMessageUserName: string = "";

  @Input() id: string;
  @Input() name: string;
  @Input() type: number;
  @Input() photo: string | null;
  @Input() lastMessage: string | null;
  @Input() lastMessageDate: number | null;
  @Input() lastMessageUserId: number | null;
  @Input() unreadMessage: number;
  @Input() createAt: string;

  public getDateMessages(lastMessageDate: number | null, createAt: string): string {
    if (lastMessageDate) {
      return new Date(lastMessageDate * 1000).toLocaleString();
    }
    else {
      return new Date(createAt).toLocaleString();
    }
  }

  public dialogHandler(e: MouseEvent, id: string) {
    e.preventDefault();
    const encodedUrl = btoa(id);
    this.router.navigateByUrl(`chat/${encodedUrl}`)
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.warn("[changes]", changes);
    if (changes.lastMessage) {
      const participantId = changes.lastMessageUserId.currentValue;
      this.store$.select(getLastMessageParticipantName, {participantId})
        .pipe(filter(v => !!v), take(1)).subscribe(name => {
        if (this.type !== 3) {
          this.lastMessageUserName = name + ': ';
        }
      })
    }
  }

}
