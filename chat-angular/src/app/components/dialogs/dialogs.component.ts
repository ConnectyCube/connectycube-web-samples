import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {AuthService} from "../../services/auth.service";
import {Store} from "@ngrx/store";
import {toggleCreatChatStatus} from "../../reducers/interface.actions";
import {MatDialog} from "@angular/material/dialog";
import {DialogCreatComponent} from "../dialog-creat/dialog-creat.component";
import {ChatService} from "../../services/chat.service";
import {dialogsSelector} from "../../reducers/dialog.selectors";
import {Observable} from "rxjs";
import {Dialog} from "../../services/config";

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  public dialogs$: Observable<Dialog[]> = this.store$.select(dialogsSelector);
  public dialogArray: Array<number> = [];
  public prevLiActiveElem: Element | null = null;
  public isScrollBarPressed = false;
  public moreIcon = 'expand_more';
  public fullName = JSON.parse(<string>localStorage.getItem('user')).full_name || 'full name';
  public avatar = JSON.parse(<string>localStorage.getItem('user')).avatar || this.fullName.slice(0, 2).toUpperCase();

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private store$: Store,
    private dialog: MatDialog
  ) {
    for (let i = 0; i < 25; i++) {
      this.dialogArray[i] = i;
    }
  }

  public logout() {
    this.authService.logout();
  }

  public addDialogEvent(e: MouseEvent) {
    this.store$.dispatch(toggleCreatChatStatus({isChatCreator: true}))
    this.dialog.open(DialogCreatComponent, {panelClass: 'create-dialog'});
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
  }

}
