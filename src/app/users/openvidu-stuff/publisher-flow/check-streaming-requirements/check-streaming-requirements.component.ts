import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-check-requirements',
    templateUrl: './check-streaming-requirements.component.html',
    styleUrls: ['./check-streaming-requirements.component.scss']
})
export class CheckStreamingRequirementsComponent implements OnInit, AfterViewInit {

    deviceRecognitionForm: FormGroup;

    userMediaDevices;
    defaultVideoDevice;
    defaultAudioDevice;

    authUser: CurrentUserData;
    deviceStatus = 'idle';

    @Output('checked') checked = new EventEmitter();

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        private _userInfoService: UserInfoService,
        // private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        this.initForm();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Check streaming requirements  AUTHUSER DATA');
        });
    }

    initForm(): void {
        this.deviceRecognitionForm = this.fb.group({
            video_device: ['', Validators.required],
            audio_device: ['', Validators.required]
        });
    }

    async startLiveVideo() {
        // if (this.deviceRecognitionForm.valid) {
        this.checked.emit(true);
        // }
    }

    async ngAfterViewInit() {
        await this.getConnectedDevices(true);
    }

    async getConnectedDevices(pageLoad = false) {

        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(() => {
            this.deviceStatus = 'loading';
            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    this.deviceStatus = 'loaded';
                    this.userMediaDevices = devices;
                    this.defaultVideoDevice = devices.find(d => d.kind === 'videoinput');
                    this.deviceRecognitionForm.patchValue({video_device: this.defaultVideoDevice?.label});
                    this.defaultAudioDevice = devices.find(d => d.kind === 'audioinput');
                    this.deviceRecognitionForm.patchValue({audio_device: this.defaultAudioDevice?.label});
                })
                .catch((err) => {

                    this.deviceRecognitionForm.patchValue({
                        audio_device: '',
                        video_device: '',
                    });
                    this.toastr.error(err.message);
                });
        }).catch((err) => {
            console.log(err);
            this.deviceStatus = 'failed';
            this.deviceRecognitionForm.patchValue({
                audio_device: '',
                video_device: '',
            });
            console.log(this.deviceRecognitionForm.value);
            this.toastr.error(err.message);
        });


    }

    get audioDevice() {
        return this.deviceRecognitionForm.get('audio_device');
    }

    get videoDevice() {
        return this.deviceRecognitionForm.get('video_device');
    }

}
