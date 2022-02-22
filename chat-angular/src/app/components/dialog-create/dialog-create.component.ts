import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {selectedParticipantsSelector} from "../../reducers/participants/participants.selectors";
import {participant} from "../../reducers/participants/participants.reducer";
import {MatDialog} from "@angular/material/dialog";
import {SelectParticipantsComponent} from "../select-participants/select-participants.component";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import {
  addParticipants,
  removeAllSelectedParticipants,
  removeSelectedParticipant
} from "../../reducers/participants/participants.actions";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-dialog-create',
  templateUrl: './dialog-create.component.html',
  styleUrls: ['./dialog-create.component.scss']
})
export class DialogCreateComponent implements OnInit, OnDestroy {

  public participants$: Observable<Array<participant>> = this.store$.select(selectedParticipantsSelector);

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

  public addParticipants() {
    this.store$.select(selectedParticipantsSelector).pipe(take(1)).subscribe(participants => {
      if (participants) {
        const isCreateDialog = true;
        this.dialog.open(SelectParticipantsComponent, {
          panelClass: 'select-dialog', disableClose: true,
          data: {participants, isCreateDialog}
        });
      }
    })
  }

  public removeParticipant(id: number) {
    this.store$.dispatch(removeSelectedParticipant({id}));
  }

  public getErrors(value: string) {
    return this.CreateForm.get(value);
  }

  public createDialog() {
    this.store$.select(selectedParticipantsSelector).pipe(take(1)).subscribe(res => {
      if (res) {
        const name = this.CreateForm.value.name;
        const description = this.CreateForm.value.description;
        const idArray = res.map((p: participant) => p.id);
        console.log(name, description, idArray)
        this.store$.dispatch(addParticipants({participants: res}));
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
