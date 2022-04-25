import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {ProfileFormComponent} from './show-profile/profile-form/profile-form.component';
import {SharedModule} from '@shared/shared.module';
import {VideoComponent} from '@app/users/openvidu-stuff/publisher-flow/video/video.component';
import {PublisherComponent} from './openvidu-stuff/openvidu-test/publisher/publisher.component';
import {SubscriberComponent} from './openvidu-stuff/openvidu-test/subscriber/subscriber.component';
import {UserVideoComponent} from './openvidu-stuff/subscriber-flow/user-video/user-video.component';
import {OvVideoComponent} from './openvidu-stuff/subscriber-flow/ov-video/ov-video.component';
import {VideoLibraryComponent} from './openvidu-stuff/openvidu-test/video-library/video-library.component';
import {OpenviduSessionModule} from 'openvidu-angular';
import {JoinStreamingFormComponent} from './openvidu-stuff/openvidu-test/join-streaming-form/join-streaming-form.component';
import {HomeComponent} from '@app/users/home/home.component';
import {CheckStreamingRequirementsComponent} from './openvidu-stuff/publisher-flow/check-streaming-requirements/check-streaming-requirements.component';
import {PublisherFlowComponent} from './openvidu-stuff/publisher-flow/publisher-flow.component';
import {SubscriberFlowComponent} from './openvidu-stuff/subscriber-flow/subscriber-flow.component';
import {CollectStreamingDetailsFormComponent} from './openvidu-stuff/publisher-flow/collect-streaming-details-form/collect-streaming-details-form.component';
import {JoinVideoStreamingComponent} from './openvidu-stuff/subscriber-flow/join-video-streaming/join-video-streaming.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { ConnectionsTabComponent } from './show-profile/connections-tab/connections-tab.component';
import { ConnectionRequestsTabComponent } from './show-profile/connection-requests-tab/connection-requests-tab.component';
import {ShowNotificationsComponent} from '@app/users/show-notifications/show-notifications.component';
import { ShowProfileComponent } from './show-profile/show-profile.component';
import { WatchlistTabComponent } from './show-profile/watchlist-tab/watchlist-tab.component';
import { CardsTabComponent } from './show-profile/cards-tab/cards-tab.component';

@NgModule({
    declarations: [
        ProfileFormComponent,
        VideoComponent,
        PublisherComponent,
        SubscriberComponent,
        UserVideoComponent,
        OvVideoComponent,
        HomeComponent,
        VideoLibraryComponent,
        JoinStreamingFormComponent,
        CheckStreamingRequirementsComponent,
        PublisherFlowComponent,
        SubscriberFlowComponent,
        CollectStreamingDetailsFormComponent,
        JoinVideoStreamingComponent,
        PaymentSuccessComponent,
        PaymentCancelComponent,
        ConnectionsTabComponent,
        ConnectionRequestsTabComponent,
        ShowNotificationsComponent,
        ShowProfileComponent,
        WatchlistTabComponent,
        CardsTabComponent,
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        OpenviduSessionModule,
        SharedModule
    ],
    exports: []
})
export class UsersModule {
}
