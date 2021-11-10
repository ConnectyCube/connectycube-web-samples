import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {VideochatComponent} from './components/videochat/videochat.component';
import {StreamContainerComponent} from './components/stream-container/stream-container.component';
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './reducers';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from './app.effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {PreloadAllModules, RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PrejoinComponent} from './components/prejoin/prejoin.component';
import { VideochatWrapComponent } from './components/videochat-wrap/videochat-wrap.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VideochatComponent,
    StreamContainerComponent,
    PrejoinComponent,
    VideochatWrapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
        {
          path: '',
          component: LoginComponent
        },
        {
          path: 'join/:hashCode',
          component: VideochatWrapComponent,
        },
      ],
      {
        preloadingStrategy: PreloadAllModules
      }),
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot(),
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
