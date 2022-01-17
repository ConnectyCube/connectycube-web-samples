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
    if (this.SearchForm.valid) {
      const sValue = this.SearchForm.value.name;
      console.warn('[Search Value]', sValue);
      const promiseF = this.chatService.searchFullName(sValue);
      const promiseL = this.chatService.searchLogin(sValue);
      Promise.allSettled([promiseF, promiseL]).then((result: any) => {
        console.warn(result);
        const participants: Map<string, any> = new Map();
        result.forEach((item: any) => {
          if (item.hasOwnProperty("value")) {
            if (item.value.hasOwnProperty("items")) {
              console.log(item.value.items)
              item.value.items.forEach((item: any) => {
                participants.set(String(item.user.id), item.user)
              });
            }
            else {
              console.log(item.value);
              participants.set(String(item.value.user.id), item.value.user);
            }
          }
        })
        const participantArray: Array<participant> = [];
        [...participants].forEach(([key, value]) => {
          const active = this.selectedParticipant.some((p: participant) => p.id === value.id);

          if (!active) {
            participantArray.push({
              id: value.id,
              full_name: value.full_name,
              login: value.login,
              avatar: value.avatar,
              me: false,
            })
          }
        });
        console.warn(participants);
        console.warn(participantArray);
        this.store$.dispatch(addSearchParticipants({participantArray}))
      })
    }
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
