import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {AuthService} from '@core/services/auth.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-user-tags',
    templateUrl: './user-tags.component.html',
    styleUrls: ['./user-tags.component.scss']
})
export class UserTagsComponent implements OnInit {
    tags = [];
    authUser: CurrentUserData;

    @Output('tagSelected') tagSelected = new EventEmitter();

    constructor(
        private videoService: VideoService,
        public auth: AuthService,
        private _userInfoService: UserInfoService
        // private getAuthUser: GetAuthUserPipe
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        if (this.auth.loggedIn()) {
            this.getUserTags();
        }
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'WALLET SAVE CARD AUTHUSER DATA');
        });
    }

    getUserTags() {
        this.videoService.getUserTags({user_id: this.authUser?.id}).subscribe((dt: any) => {
            this.tags = dt;
        });
    }

    selectTag(name) {
        this.tagSelected.emit(name);
    }

}
