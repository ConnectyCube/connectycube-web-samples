import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  meSelector,
  selectedParticipantsSelector,
  searchedParticipantSelector
} from "../../reducers/participants/participants.selectors";
import {Store} from "@ngrx/store";
import {FormBuilder, FormControl} from "@angular/forms";
import {participant} from "../../reducers/participants/participants.reducer";
import {ChatService} from "../../services/chat.service";
import {
  addParticipants,
  addSearchParticipants, addSelectedParticipants,
  removeAllSearchParticipants,
  selectParticipant,
  unSelectParticipant
} from "../../reducers/participants/participants.actions";
import {take} from "rxjs/operators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {getDialogsMsgsCount, selectedConversationSelector} from "../../reducers/dialog/dialog.selectors";


@Component({
  selector: 'app-select-participants',
  templateUrl: './select-participants.component.html',
  styleUrls: ['./select-participants.component.scss']
})
export class SelectParticipantsComponent implements OnInit, OnDestroy {

  public selectedParticipant: Array<participant> = [];
  public participants$ = this.store$.select(selectedParticipantsSelector);
  public searchedParticipants$ = this.store$.select(searchedParticipantSelector);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { participants: Array<participant>, isCreateDialog: boolean },
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
    this.chatService.searchMethod(this.SearchForm, this.selectedParticipant);
  }

  public selectParticipant(e: any, user: participant) {
    this.store$.dispatch(selectParticipant({id: user.id}));
    this.selectedParticipant = [...this.selectedParticipant, ...[user]];
    console.warn(this.selectedParticipant)
  }

  public unselectParticipant(user: participant) {
    this.store$.dispatch(unSelectParticipant({p: user}));
    this.selectedParticipant = this.selectedParticipant.filter((p: participant) => p.id !== user.id);
  }

  public select() {
    console.warn(this.data.isCreateDialog)
    if (this.data.isCreateDialog) {
      this.selectAll();
    }
    else {
      this.addAll();
    }
  }

  public selectAll() {
    this.store$.dispatch(addSelectedParticipants({selectedParticipant: this.selectedParticipant}))
  }

  public addAll() {
    const addedParticipants: Array<participant> = this.selectedParticipant.filter((p: participant) => !p.unselect);
    if (addedParticipants.length !== 0) {
      const addedParticipantsIds: Array<number> = addedParticipants.map((p: participant) => p.id);

      this.store$.dispatch(addParticipants({participants: addedParticipants}));

      this.store$.select(selectedConversationSelector).pipe(take(1)).subscribe(selectedConversation => {
        if (selectedConversation) {
          this.chatService.addMembersToGroupChat(selectedConversation, addedParticipantsIds).then((dialog: any) => {
            console.warn(dialog);
            dialog.occupants_ids.forEach((id: number) => {
              // add dialog participants to old participants
              if (!addedParticipantsIds.includes(id)) {
                const command = "dialog/ADD_DIALOG_PARTICIPANTS";
                console.warn(addedParticipantsIds);
                this.chatService.sendSystemMsg(id, selectedConversation, command, {addedParticipantsIds});
              }
              // add dialog to added participants
              else {
                this.store$.select(getDialogsMsgsCount).pipe(take(1)).subscribe(msgCount => {
                  const command = "dialog/NEW_DIALOG";
                  this.chatService.sendSystemMsg(id, selectedConversation, command, {msgCount});
                })
              }
            })
          })
        }
      })
    }
  }

  ngOnInit(): void {
    console.warn(this.data);
    if (this.data) {
      this.selectedParticipant = this.data.participants;
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
