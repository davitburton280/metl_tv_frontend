import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {DESCRIPTION_CHARACTERS_LIMIT} from '@core/constants/global';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';

@Component({
    selector: 'app-about-tab',
    templateUrl: './about-tab.component.html',
    styleUrls: ['./about-tab.component.scss']
})
export class AboutTabComponent implements OnInit, AfterViewInit {
    aboutForm: FormGroup;
    editMode = false;
    authUser;
    @Input('channelUser') channelUser;

    constructor(
        private fb: FormBuilder,
        private channelService: ChannelsService,
        private getAuthUser: GetAuthUserPipe,
        private fixLineBreaks: FixTextLineBreaksPipe
    ) {
        this.authUser = this.getAuthUser.transform();
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
