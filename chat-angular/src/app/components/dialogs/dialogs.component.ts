import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {AuthService} from "../../services/auth.service";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {DialogCreatComponent} from "../dialog-creat/dialog-creat.component";
import {ChatService} from "../../services/chat.service";
import {
  dialogsSearchSelector,
  dialogsSelector,
  selectedConversationSelector
} from "../../reducers/dialog/dialog.selectors";
import {Observable} from "rxjs";
import {Dialog} from "../../services/config";
import {FormControl} from "@angular/forms";
import {meSelector} from "../../reducers/participants/participants.selectors";
import {participant} from "../../reducers/participants/participants.reducer";
import {DialogOneOneComponent} from "../dialog-one-one/dialog-one-one.component";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  public dialogs$: Observable<Dialog[]> = this.store$.select(dialogsSelector);
  public selectedConversation$ = this.store$.select(selectedConversationSelector);
  public userMe: participant = {login: "", me: true, id: 404, avatar: null, full_name: ""};
  public prevLiActiveElem: Element | null = null;
  public isScrollBarPressed = false;
  public moreIcon = 'expand_more';

  public dialog_name = new FormControl('');

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private store$: Store,
    private dialog: MatDialog,
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
    this.store$.select(meSelector).pipe(takeWhile(res => !res, true),).subscribe(res => {
      if (res) {
        this.userMe = res;
        console.warn(res);
      }
    });
  }

}
