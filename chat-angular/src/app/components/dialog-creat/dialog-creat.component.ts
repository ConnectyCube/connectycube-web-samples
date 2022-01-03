import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-dialog-creat',
  templateUrl: './dialog-creat.component.html',
  styleUrls: ['./dialog-creat.component.scss']
})
export class DialogCreatComponent implements OnInit {

  public CreateForm = this.fb.group({
    name: new FormControl('')
  })

  constructor(private fb: FormBuilder) {
  }

  public getErrors(value: string) {
    return this.CreateForm.get(value);
  }

  public onSubmitSearch() {

  }

  ngOnInit(): void {
  }

}
