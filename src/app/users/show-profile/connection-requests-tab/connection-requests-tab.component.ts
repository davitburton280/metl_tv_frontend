import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-connection-requests-tab',
    templateUrl: './connection-requests-tab.component.html',
    styleUrls: ['./connection-requests-tab.component.scss']
})
export class ConnectionRequestsTabComponent implements OnInit {
    @Input() authUser;
    @Input() connectionRequests = [];

    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.connectionRequests)
    }

    confirmConnection(connection) {

    }

    declineConnection(connection) {

    }

}
