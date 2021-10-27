import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

declare let ConnectyCube:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() JoinBtnClick:EventEmitter<boolean> = new EventEmitter<boolean>();

  private CREDENTIALS = {
    appId: 5574,
    authKey: "TZU3fqTqdJPzhDB",
    authSecret: "hacNUHLEbOtXHYJ",
  };

  private randomLogin():string
  {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";

    for(let i=0; i < 5; i++ ){
      text += possible[Math.floor(Math.random() * possible.length)];
    }

    return text;
  }

  private hashCode(s:string){
    return String(s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
  }

  private userAuthorization(userName:string){

    const login:string = this.randomLogin();

    const userProfile = {
      login: login,
      password: this.hashCode(login),
      full_name: userName,
    };


      let promise = ConnectyCube.users.signup(userProfile)
      .then((user:any)=>{

        ConnectyCube.login({login:userProfile.login,password:userProfile.password})
          .then((user:any)=>{console.log("logging user",user);this.JoinBtnClick.emit(true);})
          .catch((error:any)=>{console.log('LoginError!',error)})

      })
      .catch((error:any)=>{

        try {

          const IsRegisteredUser: boolean = error.info.errors.base.includes("login must be unique");

          if(IsRegisteredUser){
            ConnectyCube.login({login:userProfile.login,password:userProfile.password})
              .then((user:any)=>{console.log("logging user",user);this.JoinBtnClick.emit(true);})
              .catch((error:any)=>{console.log('LoginError!',error)})
          }
          else{
            console.log("signUpError",error)
          }
        }
        catch{
          console.log(error);
        }

      })

    console.log(promise)


  }


  ngOnInit(): void {

    ConnectyCube.init(this.CREDENTIALS);

    ConnectyCube.createSession();

  }

  public joinToGuestRoom(){

    const userName = prompt("Input user name","User");

    if(userName){

      this.userAuthorization(userName);

    }

  }

}
