import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './components/auth/auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import {RouterModule} from "@angular/router";
import { ChatComponent } from './components/chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import { DialogsComponent } from './components/dialogs/dialogs.component';
import { ChatMessagesComponent } from './components/chat-messages/chat-messages.component';
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatComponent,
    DialogsComponent,
    ChatMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot(),
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ScrollingModule,
    CommonModule,
    CommonModule,
    CommonModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
