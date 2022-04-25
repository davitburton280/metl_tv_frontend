import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-people-tab',
    templateUrl: './people-tab.component.html',
    styleUrls: ['./people-tab.component.scss']
})
export class PeopleTabComponent implements OnInit {
    @Input() channelUser;
    @Input() authUser;

    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.channelUser)
    }

}
