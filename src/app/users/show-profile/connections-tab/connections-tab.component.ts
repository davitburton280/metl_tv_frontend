import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-connections-tab',
    templateUrl: './connections-tab.component.html',
    styleUrls: ['./connections-tab.component.scss']
})
export class ConnectionsTabComponent implements OnInit {
    @Input() authUser;
    @Input() connections;


    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.connections)
    }


}
