import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';
import {GroupState} from '@core/services/state/group.state';
import {GroupInterface, GroupItemInterface} from '@core/interfaces/group.interface';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';

@Injectable({
    providedIn: 'root'
})
export class GroupsService {
    public groupsState$: GroupState = new GroupState();

    constructor(
        private httpClient: HttpClient,
        private socketService: SocketIoService,
        private groupsStore: GroupsStoreService,
    ) {
    }

    getGroupByCustomName(params) {

        return this.httpClient.get<any>(`${API_URL}groups/get-group-by-name`, {params});
    }

    public getGroupById(id) {

        return this.httpClient.get<any>(`${API_URL}groups/${id}`);
    }

    public getGroupList(params) {
        this.groupsState$.setLoading(true);
        this.httpClient.post<GroupInterface>(`${API_URL}groups/getList`, params)
            .subscribe((data: GroupInterface) => {
                this.groupsState$.setGroups(data.data);
                this.groupsState$.setLoading(false);
            });
    }

    get(params) {

        return this.httpClient.get<any>(`${API_URL}groups/get-regular-groups`, {params});
    }

    addGroup(params) {
        this.groupsState$.setLoading(true);
        this.httpClient.post<any>(`${API_URL}groups/create-group`, params)
            .subscribe((data: GroupItemInterface[]) => {
                this.groupsState$.setGroups(data);
                const selectedGroup = data.find(d => params.name === d.name);
                this.groupsStore.setGroups(data);
                this.groupsStore.selectGroup(selectedGroup);
                this.socketService.setNewPageGroup(params);
                this.groupsState$.setLoading(false);
            });
    }

    public remuveGroupByTypeAndGroupId(remuveData) {
        this.groupsState$.setLoading(true);
        this.httpClient.delete(`${API_URL}groups/${remuveData.id}/${remuveData.type}`)
            .subscribe((data) => {
                console.log(data);
                this.groupsState$.setLoading(false);
            });
    }

    getGroupMembers() {
        return this.httpClient.get<any>(`${API_URL}groups/get-group-members`);
    }

    addGroupMembers(params) {
        return this.httpClient.post<any>(`${API_URL}groups/add-group-members`, params);
    }

    removeGroupMember(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/remove-group-member`, {params});
    }

    removeGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/remove-group`, {params});
    }

    leaveGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}groups/leave-group`, {params});
    }

    acceptGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/accept-join-group`, params);
    }

    declineGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/decline-join-group`, params);
    }

    joinGroup(params) {
        return this.httpClient.post<any>(`${API_URL}groups/join-group`, params);
    }

    confirmGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/confirm-join-group`, params);
    }

    ignoreGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/ignore-join-group`, params);
    }

    makeAdmin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/make-member-admin`, params);
    }

    makeModerator(params) {
        return this.httpClient.put<any>(`${API_URL}groups/make-member-moderator`, params);
    }

    declineMakeAdmin(params) {
        return this.httpClient.put<any>(`${API_URL}groups/decline-make-member-admin`, params);
    }

    removeAdminPrivileges(params) {
        return this.httpClient.put<any>(`${API_URL}groups/remove-admin-privileges`, params);
    }

    public updateGroup(id, params) {

        return this.httpClient.put(`${API_URL}groups/update-group/${id}`, params);
    }


}
