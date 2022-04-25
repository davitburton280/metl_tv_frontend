import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-chat-actions',
    templateUrl: './group-chat-actions.component.html',
    styleUrls: ['./group-chat-actions.component.scss']
})
export class GroupChatActionsComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {

    }

    toggleMembersForm() {
        this.groupsMessagesStore.showMembersForm = !this.groupsMessagesStore.showMembersForm;
    }

    removeGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroup({group_id: this.selectedGroup.id}).subscribe(dt => {
                    console.log(dt)
                    this.socketService.removeGroup({group: this.selectedGroup, initiator: this.authUser});
                    this.groupsMessagesStore.setGroupsMessages(dt);
                    this.selectedGroup = null;
                });
            }
        }));
    }

    leaveGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed && this.selectedGroup) {
                this.chatService.leaveGroup({
                    member_id: this.authUser.id,
                    group_id: this.selectedGroup.id,
                }).subscribe(dt => {
                    console.log('leave group', dt, this.selectedGroup)
                    this.groupsMessagesStore.setGroupsMessages(dt);
                    this.socketService.leaveChatGroup({
                        group: this.selectedGroup,
                        from_user: this.authUser,
                        group_type: 'chat',
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has left the <strong>${this.selectedGroup.name}</strong> group`
                    });
                    this.selectedGroup = null;
                });
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
