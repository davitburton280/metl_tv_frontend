import {Component, Input, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-chat-members',
    templateUrl: './group-chat-members.component.html',
    styleUrls: ['./group-chat-members.component.scss']
})
export class GroupChatMembersComponent implements OnInit {
    @Input() authUser;
    @Input() selectedGroup;

    constructor(
        public groupChatMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
    }

}
