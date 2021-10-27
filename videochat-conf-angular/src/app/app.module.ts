import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VideochatComponent } from './videochat/videochat.component';
import { StreamContainerComponent } from './stream-container/stream-container.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VideochatComponent,
    StreamContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
