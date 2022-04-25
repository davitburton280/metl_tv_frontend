import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-avatar-handler',
    templateUrl: './group-avatar-handler.component.html',
    styleUrls: ['./group-avatar-handler.component.scss']
})
export class GroupAvatarHandlerComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];
    removeAvatarShown = false;

    @ViewChild('avatarInput') avatarInput: ElementRef;

    constructor(
        private chatService: ChatService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
    ) {
    }

    ngOnInit(): void {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            // console.log('groups changed', dt)
            // this.selectedGroup = this.groupsMessagesStore.selectedGroupMessages || dt[0];
            // console.log(this.groupsMessagesStore.selectedGroupMessages)
        });
    }

    changeAvatar(e = null) {
        const file = e?.target.files[0];

        const formData = new FormData();
        formData.append('avatar', file?.name || '');
        formData.append('group_id', this.selectedGroup.id);
        formData.append('member_id', this.authUser.id);

        if (file) {
            formData.append('group_avatar_file', file);
        } else {
            this.avatarInput.nativeElement.value = '';
        }

        this.subscriptions.push(this.chatService.changeGroupAvatar(formData).subscribe(dt => {
            // console.log(dt.find(d => this.selectedGroup.id === d.id))
            // this.groupsMessagesStore.changeGroup(dt.find(d => this.selectedGroup.id === d.id));
            this.groupsMessagesStore.setGroupsMessages(dt);
            // console.log(this.groupsMessagesStore.selectedGroupMessages)
            this.selectedGroup = dt.find(d => this.selectedGroup.id === d.id)
            // console.log(this.selectedGroup)
            // this.groupsMessagesStore.selectGroup(this.selectedGroup);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
