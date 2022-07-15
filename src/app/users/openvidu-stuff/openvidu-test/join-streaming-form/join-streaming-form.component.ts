import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-join-streaming-form',
    templateUrl: './join-streaming-form.component.html',
    styleUrls: ['./join-streaming-form.component.scss']
})
export class JoinStreamingFormComponent implements OnInit {


    // Join form
    joinSessionForm: FormGroup;
    mySessionId: string;
    myUserName: string;

    sessionName = 'SessionA';

    authUser: CurrentUserData;

    @Output() formReady = new EventEmitter();

    constructor(
        // private getAuthUser: GetAuthUserPipe,
        private _userInfoService: UserInfoService,
        private fb: FormBuilder,
    ) {
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.initForm();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Join streaming  AUTHUSER DATA');
        });
    }

    initForm() {
        this.joinSessionForm = this.fb.group({
            sessionName: [this.sessionName],
            // myUserName: ['Participant' + Math.floor(Math.random() * 100)]
            myUserName: [this.authUser.username]
        });
    }

    submit() {
        this.formReady.emit(this.joinSessionForm.value);
    }

}
