import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {isToday} from "../../../services/utilities";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {ChatService} from "../../../services/chat.service";
import {updateParticipantLastActivity} from "../../../reducers/participants/participants.actions";

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit, OnChanges {

  @Input() avatar: string;
  @Input() full_name: string;
  @Input() id: number;
  @Input() lastActivity: number | null;
  @Input() meId: number
  @Input() creatorId: number

  @Output() removeParticipantEvent: EventEmitter<number> = new EventEmitter<number>();

  public lastActivityStatus: string = "";
  public lastActivity$: Observable<number>;
  public isCreator: boolean;
  public meIsCreator: boolean;

  constructor(private store$: Store, private chatService: ChatService) {
  }

  public removeParticipant(participantId: number) {
    this.removeParticipantEvent.emit(participantId);
  }

  public getLastActivity() {

    if (this.lastActivity === null) {
      this.lastActivityStatus = "";
    }
    else if (isNaN(this.lastActivity)) {
      this.lastActivityStatus = "Last seen: some time ago";
    }
    else {
      if (this.lastActivity < 60) {
        this.lastActivityStatus = "Online";
      }
      else {
        const date = new Date(new Date().getTime() - this.lastActivity * 1000);
        const activity = isToday(date) ? date.toLocaleTimeString() : date.toLocaleString();
        this.lastActivityStatus = "Last seen: " + activity;
      }
    }
  }

  ngOnInit(): void {
    if (this.id !== this.meId) {
      this.chatService.getLastActivity(this.id).then((result: any) => {
        const seconds = result.seconds;
        this.store$.dispatch(updateParticipantLastActivity({participantId: this.id, lastActivity: seconds}));
      })
    } else {
      this.lastActivityStatus = "Online";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.creatorId) {
      this.isCreator = this.id === this.creatorId;
      this.meIsCreator = this.creatorId === this.meId;
    }
    if (changes.lastActivity && changes.lastActivity.currentValue !== changes.lastActivity.previousValue) {
      this.getLastActivity();
    }
  }

}
