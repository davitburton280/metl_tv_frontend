import {Component, Input, OnInit} from '@angular/core';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';

@Component({
    selector: 'app-group-chat-left-side-holder',
    templateUrl: './group-chat-left-side-holder.component.html',
    styleUrls: ['./group-chat-left-side-holder.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class GroupChatLeftSideHolderComponent implements OnInit {
    @Input() authUser;

    constructor(
        public mobileHelper: MobileResponsiveHelper,
    ) {
    }

    ngOnInit(): void {
    }

}
