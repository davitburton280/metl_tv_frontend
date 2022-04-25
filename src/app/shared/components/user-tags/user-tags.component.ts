import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-user-tags',
    templateUrl: './user-tags.component.html',
    styleUrls: ['./user-tags.component.scss']
})
export class UserTagsComponent implements OnInit {
    tags = [];
    authUser;

    @Output('tagSelected') tagSelected = new EventEmitter();

    constructor(
        private videoService: VideoService,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        if (this.auth.loggedIn()) {
            this.getUserTags();
        }
    }

    getUserTags() {
        this.videoService.getUserTags({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.tags = dt;
        });
    }

    selectTag(name) {
        this.tagSelected.emit(name);
    }

}
