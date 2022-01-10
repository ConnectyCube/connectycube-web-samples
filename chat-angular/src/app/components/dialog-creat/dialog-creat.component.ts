import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {participantSelector} from "../../reducers/participants.selectors";
import {participant} from "../../reducers/participants.reducer";
import {MatDialog} from "@angular/material/dialog";
import {SelectParticipantsComponent} from "../select-participants/select-participants.component";

@Component({
  selector: 'app-dialog-creat',
  templateUrl: './dialog-creat.component.html',
  styleUrls: ['./dialog-creat.component.scss']
})
export class DialogCreatComponent implements OnInit {

  public participants$ = this.store$.select(participantSelector);

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
    private dialog: MatDialog
  ) {
  }

  public addParticipants() {
    this.dialog.open(SelectParticipantsComponent, {panelClass: 'select-dialog', disableClose: true});
  }

  public getErrors(value: string) {
    return this.CreateForm.get(value);
  }

  public onSubmitSearch() {

  }

  ngOnInit(): void {
  }

}
