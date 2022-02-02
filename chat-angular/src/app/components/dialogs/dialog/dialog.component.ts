import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {selectedConversationSelector} from "../../../reducers/dialog/dialog.selectors";
import {Store} from "@ngrx/store";
import {ChatService} from "../../../services/chat.service";
import {Router} from "@angular/router";
import {getLastMessageParticipantName} from "../../../reducers/participants/participants.selectors";
import {filter, take} from "rxjs/operators";
import {participant} from "../../../reducers/participants/participants.reducer";
import {addParticipants} from "../../../reducers/participants/participants.actions";

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
  public itemLastMessage: string | null = "";

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

  public getUsersFromSDK(participantId: number) {
    this.chatService.searchUsersById([participantId]).then((result: any) => {
      console.warn("[searchUserById]", result);
      if (result.length > 0) {
        const participants: Array<participant> = result.items.map((u: any) => {
          return {
            id: u.user.id,
            full_name: u.user.full_name,
            login: u.user.login,
            avatar: u.user.avatar,
            me: u.user.login === atob(<string>localStorage.getItem('login')),
          }
        })
        this.itemLastMessage = participants[0].full_name + ": " + this.lastMessage;
        this.store$.dispatch(addParticipants({participants}));
      }
    })
      .catch((error: any) => {
        console.error(error);
      })
  }

  public getLastMessageUserName(participantId: number | null) {
    if (participantId === null) {
      return "No messages yet";
    }
    //If group chat
    if (this.type === 2) {
      this.store$.select(getLastMessageParticipantName, {participantId})
        .pipe(filter(v => v !== undefined), take(1)).subscribe(name => {
        if (name) {
          this.lastMessageUserName = name;
        }
        else {
          this.getUsersFromSDK(participantId);
        }
      })
      return this.lastMessageUserName + ': ' + this.lastMessage;
    }
    // else individual chat
    else {
      return this.lastMessage;
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lastMessage && changes.lastMessage.currentValue !== changes.lastMessage.previousValue) {
      const participantId = changes.lastMessageUserId ? changes.lastMessageUserId.currentValue : this.lastMessageUserId;
      this.itemLastMessage = this.getLastMessageUserName(participantId);
    }
  }

}
