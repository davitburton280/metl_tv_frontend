import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GroupsRoutingModule} from './groups-routing.module';
import {ShowGroupsComponent} from './show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {SharedModule} from '@shared/shared.module';
import {GroupItemComponent} from './show-groups/group-item/group-item.component';
import {AboutTabComponent} from './single-group/about-tab/about-tab.component';
import {PeopleTabComponent} from './single-group/people-tab/people-tab.component';
import {MediaTabComponent} from './single-group/media-tab/media-tab.component';
import {PostsTabComponent} from './single-group/posts-tab/posts-tab.component';
import {AdminsListComponent} from './single-group/people-tab/admins-list/admins-list.component';
import {GroupMembersListComponent} from './single-group/people-tab/group-members-list/group-members-list.component';
import {MemberRequestsListComponent} from './single-group/people-tab/member-requests-list/member-requests-list.component';
import {GroupMembersActionsMenuComponent} from './single-group/people-tab/group-members-actions-menu/group-members-actions-menu.component';
import {EditGroupComponent} from '@app/groups/single-group/edit-group';
import {ReactiveFormsModule} from '@angular/forms';
import {DeleteGroupDialog} from '@app/groups/dialogs';


@NgModule({
    declarations: [
        ShowGroupsComponent,
        SingleGroupComponent,
        GroupItemComponent,
        AboutTabComponent,
        PeopleTabComponent,
        MediaTabComponent,
        PostsTabComponent,
        AdminsListComponent,
        GroupMembersListComponent,
        MemberRequestsListComponent,
        EditGroupComponent,
        GroupMembersActionsMenuComponent,
        DeleteGroupDialog
    ],
    imports: [
        CommonModule,
        GroupsRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ],
    entryComponents:[
        DeleteGroupDialog
    ]
})
export class GroupsModule {
}
