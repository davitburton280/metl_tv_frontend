import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getChatMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/get-messages`, {params});
    }

    saveVideoMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/video/save-message`, params);
    }

    /* DIRECT CHAT STUFF*/

    getDirectMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/direct/get-direct-messages`, {params});
    }

    getMessagesBetweenTwoUsers(params) {
        return this.httpClient.get<any>(`${API_URL}chat/direct/get-messages-between-two-users`, {params});
    }

    getConnectionMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/direct/get-connection-messages`, {params});
    }

    unreadLastMessages(params) {
        return this.httpClient.put<any>(`${API_URL}chat/unread-last-messages`, params);
    }

    saveDirectMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/direct/save-message`, params);
    }

    /* GROUP CHAT STUFF*/

    getGroupChatMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/group/get-group-chat-messages`, {params});
    }

    getGroupsMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/group/get-groups-messages`, {params});
    }

    saveGroupMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/group/save-message`, params);
    }


    getChatGroups(params) {
        return this.httpClient.get<any>(`${API_URL}chat/group/get-chat-groups`, {params});
    }

    addGroup(params) {
        return this.httpClient.post<any>(`${API_URL}chat/group/create-group`, params);
    }

    getGroupMembers(params) {
        return this.httpClient.get<any>(`${API_URL}chat/group/get-group-members`, {params});
    }

    inviteMembers(params) {
        return this.httpClient.post<any>(`${API_URL}chat/group/invite-group-members`, params);
    }

    removeGroupMember(params) {
        return this.httpClient.delete<any>(`${API_URL}chat/group/remove-group-member`, {params});
    }

    removeGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}chat/group/remove-group`, {params});
    }

    leaveGroup(params) {
        return this.httpClient.delete<any>(`${API_URL}chat/group/leave-group`, {params});
    }

    acceptGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}chat/group/accept-join-group`, params);
    }

    declineGroupJoin(params) {
        return this.httpClient.put<any>(`${API_URL}chat/group/decline-join-group`, params);
    }


    changeGroupAvatar(params) {
        return this.httpClient.post<any>(`${API_URL}chat/group/change-group-avatar`, params);
    }

}
