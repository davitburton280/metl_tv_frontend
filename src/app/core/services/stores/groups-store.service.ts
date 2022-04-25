import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsStoreService {
    protected groupsSource = new BehaviorSubject([]);
    protected selectedGroupSource = new BehaviorSubject({});

    groups$ = this.groupsSource.asObservable();
    selectedGroup$ = this.selectedGroupSource.asObservable();

    constructor() {
    }

    get groups() {
        return this.groupsSource.getValue();
    }

    setGroups(groups: any) {
        this.groupsSource.next([...groups]);
    }

    get selectedGroup() {
        return this.selectedGroupSource.getValue() as any;
    }

    selectGroup(group: any) {
        this.selectedGroupSource.next(group);
    }

    changeGroup(group: any) {
        const allGroups = [...this.groups];
        console.log(allGroups, this.groups, group.id)
        let selectedGroupIndex = allGroups.findIndex(gm => {
            return gm.id === group?.id;
        });

        if (selectedGroupIndex === -1) {
            console.log(allGroups.length)
            selectedGroupIndex = allGroups.length;
        }

        allGroups[selectedGroupIndex] = group;
        console.log(allGroups, this.groups)
        this.setGroups(allGroups);
        if (group.id === this.selectedGroup.id) {
            this.selectGroup(group);
        }
    }

}
