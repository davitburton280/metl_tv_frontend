import {Component, Input, OnInit} from '@angular/core';
import {GroupsService} from '@core/services/groups.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {SocketIoService} from '@core/services/socket-io.service';

@Component({
    selector: 'app-member-requests-list',
    templateUrl: './member-requests-list.component.html',
    styleUrls: ['./member-requests-list.component.scss']
})
export class MemberRequestsListComponent implements OnInit {

    @Input() authUser;
    @Input() selectedGroup;
    @Input() requestedMembers;
    subscriptions = [];

    constructor(
        private groupsStore: GroupsStoreService,
        private groupsService: GroupsService,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
    }

    confirmJoinGroup(member) {
        this.subscriptions.push(this.groupsService.confirmGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsStore.changeGroup(selectedGroup);

            this.socketService.confirmJoinGroup({
                group: selectedGroup,
                from_user: this.authUser,
                member,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has confirmed  <strong>${member.first_name + ' ' + member.last_name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

    ignoreJoinGroup(member) {
        console.log(member);
        this.subscriptions.push(this.groupsService.ignoreGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsStore.changeGroup(selectedGroup);

            this.socketService.ignoreJoinGroup({
                group: selectedGroup,
                from_user: this.authUser,
                member,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has declined  <strong>${member.first_name}</strong> <strong>${member.last_name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

}
