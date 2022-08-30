import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-admins-list',
    templateUrl: './admins-list.component.html',
    styleUrls: ['./admins-list.component.scss']
})
export class AdminsListComponent implements OnInit {
    @Input() admins;
    @Input() authUser;
    @Input() selectedGroup;
    @Input() isOwnGroup;

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.selectedGroup,"HRach");
    }

    isGroupCreator(admin) {
        return admin.id === this.selectedGroup?.creator_id;
    }

    isGroupAdmin(admin) {
        return !!admin.groups_members.is_admin;
    }


    getUserGroupConnection(user) {
        let connection;
        this.admins.map(a => {
            if (a.id === user?.id) {
                connection = a.groups_members.is_admin ? 'Admin' : 'Moderator';

                if (this.isGroupCreator(user)) {
                    connection = 'Group creator';
                }
            }
        });
        return connection;
    }

    showActionsMenu(admin) {
        if (this.authUserGroupConnection === 'Admin') {
            return !this.isGroupCreator(admin) && (admin.id === this.authUser.id || admin.groups_members.is_moderator);
        } else if (this.authUserGroupConnection === 'Group creator') {
            return !this.isGroupCreator(admin);
        }
        return false;
    }

    getRoleName(admin) {
        return this.getUserGroupConnection(admin);
    }

    get authUserGroupConnection(): string {
        return this.getUserGroupConnection(this.authUser);
    }

}
