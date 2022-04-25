import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Subscription} from 'rxjs';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-subscriptions-tab',
    templateUrl: './subscriptions-tab.component.html',
    styleUrls: ['./subscriptions-tab.component.scss']
})
export class SubscriptionsTabComponent implements OnInit, OnDestroy {

    @Input() authUser;
    @Input() channelUser;
    userChannels;
    apiUrl = API_URL;
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

    constructor(
        private channelsService: ChannelsService,
        public auth: AuthService,
        public router: Router,
        private subject: SubjectService
    ) {

    }

    ngOnInit(): void {
        this.getUserChannelSubscriptions();
    }

    getUserChannelSubscriptions() {
        this.subscriptions.push(this.channelsService.getSubscriptions({user_id: this.channelUser.id}).subscribe(dt => {
            this.userChannels = dt;
            // console.log(this.userChannels)
        }));
    }


    checkIfSubscribed(channel) {
        return channel.channel_subscribers.subscriber_id === this.authUser?.id;
    }

    subscribeToChannel(channel) {
        this.subscriptions.push(this.channelsService.subscribeToChannel({
            user_id: this.authUser.id,
            channel_id: channel.id
        }).subscribe(dt => {
            this.subscriptions.push(this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
                this.getUserChannelSubscriptions();
            }));
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
