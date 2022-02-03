import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dialog} from "../../services/config";

@Component({
  selector: 'app-private-dialog-details',
  templateUrl: './private-dialog-details.component.html',
  styleUrls: ['./private-dialog-details.component.scss']
})
export class PrivateDialogDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dialog: Dialog }) { }

  ngOnInit(): void {
  }

}
