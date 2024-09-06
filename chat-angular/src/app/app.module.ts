import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './components/auth/auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from './app.effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {RouterModule} from "@angular/router";
import {ChatComponent} from './components/chat/chat.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {DialogsComponent} from './components/dialogs/dialogs.component';
import {ChatMessagesComponent} from './components/chat-messages/chat-messages.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {CustomVirtualScrollDirective} from "./directives/custom-virtual-scroll-strategy-directive";
import {MatDialogModule} from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { DialogCreateComponent } from './components/dialog-create/dialog-create.component';
import {MatMenuModule} from "@angular/material/menu";
import { SelectParticipantsComponent } from './components/select-participants/select-participants.component';
import { DialogOneOneComponent } from './components/dialog-one-one/dialog-one-one.component';
import { DialogComponent } from './components/dialogs/dialog/dialog.component';
import { MessageComponent } from './components/chat-messages/message/message.component';
import { GroupChatDetails } from './components/group-chat-details/group-chat-details';
import { ParticipantComponent } from './components/group-chat-details/participant/participant.component';
import { ConfirmDeleteComponent } from './components/group-chat-details/confirm-delete/confirm-delete.component';
import { UserProfile } from './components/user-profile/user-profile';
import { ParticipantInfoComponent } from './components/participant-info/participant-info.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ChatComponent,
    DialogsComponent,
    ChatMessagesComponent,
    CustomVirtualScrollDirective,
    ModalComponent,
    DialogCreateComponent,
    SelectParticipantsComponent,
    DialogOneOneComponent,
    DialogComponent,
    MessageComponent,
    GroupChatDetails,
    ParticipantComponent,
    ConfirmDeleteComponent,
    UserProfile,
    ParticipantInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production, connectInZone: true}),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot(),
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    NoopAnimationsModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
