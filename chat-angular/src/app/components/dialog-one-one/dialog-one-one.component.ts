import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {ChatService} from "../../services/chat.service";
import {participant} from "../../reducers/participants/participants.reducer";
import {addSearchParticipants, removeAllSearchParticipants} from "../../reducers/participants/participants.actions";
import {selectedParticipantsSelector, searchedParticipantSelector} from "../../reducers/participants/participants.selectors";

@Component({
  selector: 'app-dialog-one-one',
  templateUrl: './dialog-one-one.component.html',
  styleUrls: ['./dialog-one-one.component.scss']
})
export class DialogOneOneComponent implements OnInit, OnDestroy {

  public participants$ = this.store$.select(selectedParticipantsSelector);
  public searchedParticipants$ = this.store$.select(searchedParticipantSelector);

  constructor(
    private fb: FormBuilder,
    private store$: Store,
    private dialog: MatDialog,
    private chatService: ChatService
  ) {
  }

  participantsTrackBy(index: number, participant: participant) {
    return participant.id;
  }

  public SearchForm = this.fb.group({
    name: new FormControl(''),
  })

  public SearchSubmit() {
    this.chatService.searchMethod(this.SearchForm, []);
  }

  public createChat(e: any, userId: number) {
    this.chatService.createIndividualChat(userId);
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.store$.dispatch(removeAllSearchParticipants());
  }

}
