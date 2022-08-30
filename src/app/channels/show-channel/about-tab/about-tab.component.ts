import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {DESCRIPTION_CHARACTERS_LIMIT} from '@core/constants/global';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-about-tab',
    templateUrl: './about-tab.component.html',
    styleUrls: ['./about-tab.component.scss']
})
export class AboutTabComponent implements OnInit, AfterViewInit {
    aboutForm: FormGroup;
    editMode = false;
    authUser: CurrentUserData;
    @Input('channelUser') channelUser;

    constructor(
        private fb: FormBuilder,
        private channelService: ChannelsService,
        // private getAuthUser: GetAuthUserPipe,
        private fixLineBreaks: FixTextLineBreaksPipe,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.aboutForm = this.fb.group({
                description: ['', [Validators.required, Validators.maxLength(DESCRIPTION_CHARACTERS_LIMIT)]],
                id: ['', Validators.required],
                username: ['', Validators.required]
            },
        );
        this.aboutForm.patchValue({
            username: this.channelUser.username,
            id: this.channelUser.channel.id,
            description: this.fixLineBreaks.transform(this.channelUser.channel.description)
            // ...this.channelUser.channel
        });

    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'About Tab  AUTHUSER DATA');
        });
    }

    editModeOn() {
        this.editMode = true;
    }

    saveChannelDescription() {
        if (this.aboutForm.valid) {
            this.channelService.saveDescription(this.aboutForm.value).subscribe(dt => {
                this.channelUser = dt;
                document.querySelector('.description').innerHTML = this.channelUser.channel.description;
                this.editMode = false;
            });
        }
    }

    ngAfterViewInit() {
        document.querySelector('.description').innerHTML = this.channelUser.channel.description;
    }

}
