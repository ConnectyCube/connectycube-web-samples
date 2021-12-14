import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {appConfig, CREDENTIALS} from "../../services/config";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public authStatus: string = 'Log in';
  public authStatusText: string = 'Sign up';

  public getErrors(value: string) {
    return this.authForm.get(value);
  }

  public authForm = this.fb.group({
    name: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl('')
  })

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  public onSubmit() {
    console.log("PREVALID")
    if (this.authForm.valid) {
      console.log("VALID")
      if (this.authStatus === "Log in") {
        console.warn("[Login]", this.authForm.value);
        this.authService.init(CREDENTIALS, appConfig)
        this.authService.login(this.authForm.value.login, this.authForm.value.password, true);
      }
      else if (this.authStatus === "Sign up") {
        console.warn("[Sign up]", this.authForm.value);
        this.authService.init(CREDENTIALS, appConfig)
        this.authService.auth(this.authForm.value.name, this.authForm.value.login, this.authForm.value.password);
      }
      this.authForm.reset()
    }
  }

  public toggleAuthStatus() {
    if (this.authStatus === 'Log in') {
      this.authStatus = 'Sign up';
      this.authStatusText = 'Sign in';
    }
    else {
      this.authStatus = 'Log in';
      this.authStatusText = 'Sign up';
    }
  }

  ngOnInit(): void {
  }

}
