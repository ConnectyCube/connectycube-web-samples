import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-videochat-wrap',
  templateUrl: './videochat-wrap.component.html',
  styleUrls: ['./videochat-wrap.component.scss']
})
export class VideochatWrapComponent implements OnInit,OnChanges {

  public showPrejoinScreen = true;

  constructor() {
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.warn("CHANGES WRAPPER",changes);
  }

}
