import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./components/auth/auth.component";
import {ChatComponent} from "./components/chat/chat.component";
import {ChatMessagesComponent} from "./components/chat-messages/chat-messages.component";

const routes: Routes = [
  {path: 'auth', component: AuthComponent},
  {path: 'chat', component: ChatComponent, children: [{path: ':hashcode', component: ChatComponent}]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
