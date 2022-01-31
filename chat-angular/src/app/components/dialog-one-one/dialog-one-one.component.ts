import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {ChatService} from "../../services/chat.service";
import {participant} from "../../reducers/participants/participants.reducer";
import {
  addParticipants,
  addSearchParticipants,
  removeAllSearchParticipants
} from "../../reducers/participants/participants.actions";
import {
  selectedParticipantsSelector,
  searchedParticipantSelector, meSelector
} from "../../reducers/participants/participants.selectors";
import {take} from "rxjs/operators";

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
    this.store$.select(meSelector).pipe(take(1)).subscribe(userMe=>{
      if(userMe){
        this.chatService.searchMethod(this.SearchForm, [userMe]);
      }
    })
  }

  public createChat(e: any, user: participant) {
    this.store$.dispatch(addParticipants({participants: [user]}));
    this.chatService.createIndividualChat(user.id);
  }


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.store$.dispatch(removeAllSearchParticipants());
  }

}
