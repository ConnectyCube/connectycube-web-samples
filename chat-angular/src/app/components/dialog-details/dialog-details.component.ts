import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Dialog} from "../../services/config";
import {Store} from "@ngrx/store";
import {getParticipants, meSelector} from "../../reducers/participants/participants.selectors";
import {Observable} from "rxjs";
import {participant} from "../../reducers/participants/participants.reducer";
import {take} from "rxjs/operators";
import {ChatService} from "../../services/chat.service";
import {removeDialog, setNullConverastion} from "../../reducers/dialog/dialog.actions";
import {Router} from "@angular/router";
import {ConfirmDeleteComponent} from "./confirm-delete/confirm-delete.component";

@Component({
  selector: 'app-dialog-details',
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss']
})
export class DialogDetailsComponent implements OnInit {

  public dialogParticipants$: Observable<Array<participant>> = this.store$.select(getParticipants);
  public meId: number;
  public isCreator: boolean;

  constructor(
    private store$: Store,
    private chatService: ChatService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog }
  ) {
  }

  participantsTrackBy(index: number, participant: participant) {
    return participant.id;
  }

  private setNullConversation() {
    this.router.navigateByUrl("/chat/");
    this.store$.dispatch(setNullConverastion());
  }

  private openDialog(dialogId: string, id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {panelClass: 'confirm-delete', disableClose: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (dialogId && id) {
          this.chatService.sendStopTypingStatus(this.data.dialog);
          this.chatService.exitFromChat(dialogId, [id])
            .then((dialog: any) => {
              console.warn(dialog);
              dialog.occupants_ids.forEach((id: number) => {
                const command = "dialog/UPDATE_DIALOG_PARTICIPANTS";
                this.chatService.sendSystemMsg(id, dialogId, command);
              })
              this.setNullConversation();
              this.store$.dispatch(removeDialog({id: dialogId}));
            })
            .catch((error: any) => {
              console.error(error);
            });
        }
      }
    });
  }

  public exitFromDialog(dialogId: string, id: number) {
    this.openDialog(dialogId, id);
  }

  ngOnInit(): void {
    console.warn(this.data.dialog)
    this.store$.select(meSelector).pipe(take(1)).subscribe(userMe => {
      if (userMe) {
        this.meId = userMe.id;
        this.isCreator = this.data.dialog.creatorId === this.meId;
      }
    })
  }

}
