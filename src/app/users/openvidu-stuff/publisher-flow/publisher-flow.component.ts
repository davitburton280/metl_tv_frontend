import {Component, OnInit} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-publisher-flow',
    templateUrl: './publisher-flow.component.html',
    styleUrls: ['./publisher-flow.component.scss']
})
export class PublisherFlowComponent implements OnInit {

    videoSettings;
    sessionData = {sessionName: '', myUserName: ''};
    requirementsChecked = false;

    constructor(
        private subject: SubjectService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    async getPublisherData(e) {
        this.sessionData = {sessionName: e.sessionName, myUserName: e.myUserName};
        this.videoSettings = e;
        this.subject.setSessionData(this.sessionData);
        localStorage.setItem('session', JSON.stringify(this.sessionData));
        localStorage.setItem('video_settings', JSON.stringify(this.videoSettings));
        await this.router.navigate(['users/video/publish']);
    }

}
