import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

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

    authUser;

    @Output() formReady = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private fb: FormBuilder,
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.initForm();
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
