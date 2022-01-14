import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {AuthService} from "../../services/auth.service";
import {Store} from "@ngrx/store";
import {toggleCreatChatStatus} from "../../reducers/interface.actions";
import {MatDialog} from "@angular/material/dialog";
import {DialogCreatComponent} from "../dialog-creat/dialog-creat.component";
import {ChatService} from "../../services/chat.service";
import {dialogsSearchSelector, dialogsSelector} from "../../reducers/dialog.selectors";
import {Observable} from "rxjs";
import {Dialog} from "../../services/config";
import {FormControl} from "@angular/forms";
import {meSelector} from "../../reducers/participants.selectors";
import {participant} from "../../reducers/participants.reducer";
import {take} from "rxjs/operators";
import {DialogOneOneComponent} from "../dialog-one-one/dialog-one-one.component";
import {removeAllSearchParticipants} from "../../reducers/participants.actions";

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  public dialogs$: Observable<Dialog[]> = this.store$.select(dialogsSelector);
  public userMe: participant = {login: "", me: true, id: 404, avatar: null, full_name: ""};
  public prevLiActiveElem: Element | null = null;
  public isScrollBarPressed = false;
  public moreIcon = 'expand_more';

  public dialog_name = new FormControl('');

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private store$: Store,
    private dialog: MatDialog
  ) {
    this.dialog_name.valueChanges.subscribe(data => this.changeSearchValue(data.toLowerCase()));
  }

  private changeSearchValue(data: string) {
    this.dialogs$ = this.store$.select(dialogsSearchSelector, {data})
  }

  dialogTrackBy(index: number, dialog: Dialog) {
    return dialog.id;
  }

  public logout() {
    this.authService.logout();
  }

  public addOneDialogEvent() {
    this.dialog.open(DialogOneOneComponent, {panelClass: 'create-dialog-one', disableClose: true});
  }

  public addGroupDialogEvent() {
    this.dialog.open(DialogCreatComponent, {panelClass: 'create-dialog', disableClose: true});
  }

  public dialogHandler(e: MouseEvent) {
    e.preventDefault();
    this.prevLiActiveElem?.classList.remove("active");
    const activeLiElem = (<HTMLLinkElement>e.target).closest('.dialog__list-item');
    activeLiElem?.classList.add("active");
    this.prevLiActiveElem = activeLiElem;
  }

  public moreHandler() {
    if (this.moreIcon === 'expand_less') {
      this.moreIcon = 'expand_more';
    }
    else {
      this.moreIcon = 'expand_less';
    }
  }

  public getDateMessages(lastMessageDate: number | null, createAt: string): string {
    if (lastMessageDate) {
      return new Date(lastMessageDate * 1000).toLocaleString();
    }
    else {
      return new Date(createAt).toLocaleString();
    }
  }

  ngOnInit(): void {
    this.chatService.getDialogs();
    const subsSelect = this.store$.select(meSelector).subscribe(res => {
      if (res) {
        this.userMe = res;
      }
    })
  }

}
