import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';

@Component({
    selector: 'app-show-search-results',
    templateUrl: './show-search-results.component.html',
    styleUrls: ['./show-search-results.component.scss']
})
export class ShowSearchResultsComponent implements OnInit {

    @Input('channelsVideos') channelsVideos;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
    ) {
    }

    ngOnInit(): void {
    }

    async openChannelPage(username) {
        await this.router.navigate(['channels/' + username]);
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    subscribeToChannel(channel) {
        this.channelsService.subscribeToChannel({user_id: this.authUser.id, channel_id: channel.id}).subscribe(dt => {
            this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
                if (this.checkIfSubscribed(channel)) {
                    channel.subscribers = channel.subscribers.filter(s => s.id !== this.authUser?.id);
                } else {
                    channel.subscribers.push(this.authUser);
                }
                // console.log(channel.subscribers)
                // channel.subscribers = channel.subscribers.filter(s => s.id !== this.authUser?.id).concat([this.authUser]);
                // console.log(channel.subscribers)

                // this.searchChannelsVideos({search: this.search, filters: this.filters});
            });
        });
    }

    checkIfSubscribed(channel) {
        return channel.subscribers.find(s => s.id === this.authUser?.id);
    }

    getDesc(d) {
        return d?.replace(/<br\s*[\/]?>/gi, '\n');
    }


}
