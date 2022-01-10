import {Component, OnInit} from '@angular/core';
import {participantSelector} from "../../reducers/participants.selectors";
import {Store} from "@ngrx/store";
import {FormBuilder, FormControl} from "@angular/forms";
import {participant} from "../../reducers/participants.reducer";
import {ChatService} from "../../services/chat.service";


@Component({
  selector: 'app-select-participants',
  templateUrl: './select-participants.component.html',
  styleUrls: ['./select-participants.component.scss']
})
export class SelectParticipantsComponent implements OnInit {

  public participants$ = this.store$.select(participantSelector);

  constructor(
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
        console.warn(participants);
      })
    }
  }

  ngOnInit(): void {
  }

}
