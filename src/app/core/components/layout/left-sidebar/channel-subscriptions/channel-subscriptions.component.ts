import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {ChannelsService} from '@core/services/channels.service';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-channel-subscriptions',
    templateUrl: './channel-subscriptions.component.html',
    styleUrls: ['./channel-subscriptions.component.scss']
})
export class ChannelSubscriptionsComponent implements OnInit {

    channels = [];
    routerUrl;
    trackByElement = trackByElement;

    @Input('authUser') authUser;
    @Output('closeSidenav') closeSidenav = new EventEmitter();

    constructor(
        public auth: AuthService,
        private channelsService: ChannelsService,
        public router: Router,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {

        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                this.routerUrl = ev.url;
            }
        });


        this.channelsService.getUserChannelSubscriptions({user_id: this.authUser?.id}).subscribe(dt => {
            this.channels = dt;
        });

        this.subject.getUserSubscriptions().subscribe(dt => {
            this.channels = dt;
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        // this.channels = moveItemInArray(this.channels, event.previousIndex, event.currentIndex);

    }

    dragDropped(e, channel) {
        // console.log(e)
        // console.log(channel)
        this.channels = moveItemInArray(this.channels, e.previousIndex, e.currentIndex);
        // console.log(this.channels)
        const sendData = {
            rows: JSON.stringify(this.channels),
            channel_id: channel.id,
            user_id: this.authUser.id
        };
        this.channelsService.changeSubscriptionPriority(sendData).subscribe(dt => {
        });
    }

    async openChannelPage(channel) {
        this.closeSidenav.emit(true);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['channels/' + channel.user.username])
        );
    }

    async viewAllSubscriptions() {
        await this.router.navigate(['channels/' + this.authUser.username + '/tab/contacts']);
        this.closeSidenav.emit(true);
    }

}
