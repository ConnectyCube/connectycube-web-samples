import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {meSelector, participantSelector, searchedParticipantSelector} from "../../reducers/participants/participants.selectors";
import {Store} from "@ngrx/store";
import {FormBuilder, FormControl} from "@angular/forms";
import {participant} from "../../reducers/participants/participants.reducer";
import {ChatService} from "../../services/chat.service";
import {
  addSearchParticipants, addSelectedParticipants,
  removeAllSearchParticipants,
  selectParticipant,
  unSelectParticipant
} from "../../reducers/participants/participants.actions";
import {take} from "rxjs/operators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


@Component({
  selector: 'app-select-participants',
  templateUrl: './select-participants.component.html',
  styleUrls: ['./select-participants.component.scss']
})
export class SelectParticipantsComponent implements OnInit, OnDestroy {

  public selectedParticipant: Array<participant> = [];
  public participants$ = this.store$.select(participantSelector);
  public searchedParticipants$ = this.store$.select(searchedParticipantSelector);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Array<participant>,
    private fb: FormBuilder,
    private store$: Store,
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
    this.chatService.searchMethod(this.SearchForm,this.selectedParticipant);
  }

  public selectParticipant(e: any, user: participant) {
    this.store$.dispatch(selectParticipant({id: user.id}));
    this.selectedParticipant = [...this.selectedParticipant, ...[user]];
    console.warn(this.selectedParticipant)
  }

  public unselectParticipant(e: any, user: participant) {
    this.store$.dispatch(unSelectParticipant({p: user}));
    this.selectedParticipant = this.selectedParticipant.filter((p: participant) => p.id !== user.id);
  }

  public selectAll() {
    this.store$.dispatch(addSelectedParticipants({selectedParticipant: this.selectedParticipant}))
  }

  ngOnInit(): void {
    console.warn(this.data);
    if (this.data) {
      this.selectedParticipant = this.data;
    }
    else {
      this.store$.select(meSelector).pipe(take(1)).subscribe(res => {
        if (res) {
          this.selectedParticipant = [...this.selectedParticipant, ...[res]];
        }
      })
    }
  }

  ngOnDestroy() {
    this.store$.dispatch(removeAllSearchParticipants());
  }

}
