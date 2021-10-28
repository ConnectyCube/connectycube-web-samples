import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stream-container',
  templateUrl: './stream-container.component.html',
  styleUrls: ['./stream-container.component.scss']
})
export class StreamContainerComponent implements OnInit {

  videoWork: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
