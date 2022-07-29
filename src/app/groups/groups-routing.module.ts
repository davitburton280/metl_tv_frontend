import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowGroupsComponent} from '@app/groups/show-groups/show-groups.component';
import {SingleGroupComponent} from '@app/groups/single-group/single-group.component';
import {PeopleTabComponent} from '@app/groups/single-group/people-tab/people-tab.component';
import {AboutTabComponent} from '@app/groups/single-group/about-tab/about-tab.component';
import {MediaTabComponent} from '@app/groups/single-group/media-tab/media-tab.component';
import {PostsTabComponent} from '@app/groups/single-group/posts-tab/posts-tab.component';
import {EditGroupComponent} from '@app/groups/single-group/edit-group';


const routes: Routes = [
    {
        path: '',
        component: ShowGroupsComponent,
        data: {
            title: 'Groups'
        },
    },
    {path: 'edit/:id', component:  EditGroupComponent, data: {title: 'Group page | People tab'}},
    {
        path: ':name',
        component: SingleGroupComponent,
        children: [
            {path: 'people', component: PeopleTabComponent, data: {title: 'Group page | People tab'}},
            {path: 'about', component: AboutTabComponent, data: {title: 'Group page | About tab'}},
            {path: 'media', component: MediaTabComponent, data: {title: 'Group page | Media tab'}},
            {path: 'posts', component: PostsTabComponent, data: {title: 'Group page | Posts tab'}}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule {
}
