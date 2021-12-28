import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss']
})
export class DialogsComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  public dialogArray: Array<number> = [];
  public prevLiActiveElem: Element | null = null;
  public isScrollBarPressed = false;
  public moreIcon = 'expand_more';
  public fullName = JSON.parse(<string>localStorage.getItem('user')).full_name || 'full name';
  public avatar = JSON.parse(<string>localStorage.getItem('user')).avatar || this.fullName.slice(0, 2).toUpperCase();

  constructor(private authService: AuthService) {
    for (let i = 0; i < 25; i++) {
      this.dialogArray[i] = i;
    }
  }

  public logout() {
    this.authService.logout();
  }

  public addDialogEvent(e: MouseEvent) {
    this.dialogArray = [300, ...this.dialogArray]
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

  ngOnInit(): void {

  }

}
