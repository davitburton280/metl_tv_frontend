import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-about-tab',
    templateUrl: './about-tab.component.html',
    styleUrls: ['./about-tab.component.scss']
})
export class AboutTabComponent implements OnInit {

    @Input() selectedGroup;
    @Input() isOwnGroup;

    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.isOwnGroup)
    }

}
