import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {ChatService} from "../../services/chat.service";
import {participant} from "../../reducers/participants.reducer";
import {addSearchParticipants, removeAllSearchParticipants} from "../../reducers/participants.actions";
import {participantSelector, searchedParticipantSelector} from "../../reducers/participants.selectors";

@Component({
  selector: 'app-dialog-one-one',
  templateUrl: './dialog-one-one.component.html',
  styleUrls: ['./dialog-one-one.component.scss']
})
export class DialogOneOneComponent implements OnInit, OnDestroy {

  public participants$ = this.store$.select(participantSelector);
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
          participantArray.push({
            id: value.id,
            full_name: value.full_name,
            login: value.login,
            avatar: value.avatar,
            me: false,
          })
        });
        console.warn(participants);
        console.warn(participantArray);
        this.store$.dispatch(addSearchParticipants({participantArray}))
      })
    }
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
