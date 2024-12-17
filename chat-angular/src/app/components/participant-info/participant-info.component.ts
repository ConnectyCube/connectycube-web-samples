import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {participant} from "../../reducers/participants/participants.reducer";

@Component({
  selector: 'app-participant-info',
  templateUrl: './participant-info.component.html',
  styleUrls: ['./participant-info.component.scss'],
})
export class ParticipantInfoComponent implements OnInit {
  @Input() id: number;
  @Input() full_name: string;
  @Input() login: string;
  @Input() avatar: string | null;
  @Input() isMe: boolean;
  @Input() participant: participant;
  @Input() unselected: boolean | undefined;

  @Output() removeParticipantEvent: EventEmitter<participant> =
    new EventEmitter<participant>();

  constructor(private store$: Store) {}

  removeParticipant(e: any) {
    this.removeParticipantEvent.emit(this.participant);
  }

  ngOnInit(): void {}
}
