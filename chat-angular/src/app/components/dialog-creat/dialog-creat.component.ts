import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {participantSelector} from "../../reducers/participants/participants.selectors";
import {participant} from "../../reducers/participants/participants.reducer";
import {MatDialog} from "@angular/material/dialog";
import {SelectParticipantsComponent} from "../select-participants/select-participants.component";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import {removeAllSelectedParticipants, removeParticipant} from "../../reducers/participants/participants.actions";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-dialog-creat',
  templateUrl: './dialog-creat.component.html',
  styleUrls: ['./dialog-creat.component.scss']
})
export class DialogCreatComponent implements OnInit, OnDestroy {

  public participants$: Observable<Array<participant>> = this.store$.select(participantSelector);

  participantsTrackBy(index: number, participant: participant) {
    return participant.id;
  }

  public CreateForm = this.fb.group({
    name: new FormControl(''),
    description: new FormControl('')
  })

  constructor(
    private fb: FormBuilder,
    private store$: Store,
    private dialog: MatDialog,
    private chatService: ChatService
  ) {
  }

  public editParticipants() {
    this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
      if (res) {
        this.dialog.open(SelectParticipantsComponent, {
          panelClass: 'select-dialog', disableClose: true,
          data: res
        });
      }
    })
  }

  public addParticipants() {
    this.dialog.open(SelectParticipantsComponent, {panelClass: 'select-dialog', disableClose: true});
  }

  public removeParticipant(e: any, id: number) {
    this.store$.dispatch(removeParticipant({id}));
  }

  public getErrors(value: string) {
    return this.CreateForm.get(value);
  }

  public createDialog() {
    this.store$.select(participantSelector).pipe(take(1)).subscribe(res => {
      if (res) {
        const name = this.CreateForm.value.name;
        const description = this.CreateForm.value.description;
        const idArray = res.map((p: participant) => p.id);
        console.log(name, description, idArray)
        this.chatService.createGroupChat(name, description, idArray);
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.store$.dispatch(removeAllSelectedParticipants());
  }

}
