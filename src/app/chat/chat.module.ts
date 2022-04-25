import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChatRoutingModule} from './chat-routing.module';
import {ShowChatroomsComponent} from './show-chatrooms/show-chatrooms.component';
import {ShowMessagesComponent} from './show-messages/show-messages.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
    declarations: [
        ShowChatroomsComponent,
        ShowMessagesComponent,
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        SharedModule
    ],
    providers: [
    ]
})
export class ChatModule {
}
