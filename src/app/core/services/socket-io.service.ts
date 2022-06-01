import {Injectable} from '@angular/core';
import {SOCKET_URL} from '@core/constants/global';
import {io, Socket} from 'socket.io-client';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SocketIoService {
    private socket: Socket;

    constructor() {
        this.setupSocketConnection();
    }

    setupSocketConnection() {
        this.socket = io(SOCKET_URL);
    }

    addNewUser(user, login = false) {
        if (login) {
            this.setupSocketConnection();
        }
        // console.log('add to socket!!!', users)
        // console.log(this.socket)
        this.socket.emit('newUser', user);
    }

    connectWithUser(data) {
        this.socket.emit('connectWithUser', data);
    }

    getConnectWithUser() {
        return new Observable(observer => {
            this.socket.on('getConnectWithUser', msg => {
                console.log(msg);
                observer.next(msg);
            });
        });
    }

    disconnectUsers(data) {
        this.socket.emit('disconnectUsers', data);
    }

    getDisconnectUsers() {
        return new Observable(observer => {

            this.socket.on('getDisconnectUsers', msg => {
                observer.next(msg);
            });
        });
    }

    getConnectedUsers(data) {
        this.socket.emit('getConnectedUsers', data);
    }

    usersOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('usersConnected', msg => {
                observer.next(msg);
            });
        });
    }

    userOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('onGetOnlineUsers', msg => {
                observer.next(msg);
            });
        });
    }

    getConnectedGroupMembers(data) {
        this.socket.emit('getConnectedGroupMembers', data);
    }

    membersOnlineFeedback() {
        return new Observable(observer => {
            this.socket.on('onGetOnlineMembers', msg => {
                observer.next(msg);
            });
        });
    }


    // EMITTER example
    sendMessage(data: any) {
        this.socket.emit('sendMessage', data);
    }

    // HANDLER example
    onNewMessage() {
        return new Observable(observer => {
            this.socket.on('newMessage', msg => {
                observer.next(msg);
            });
        });
    }

    setTyping(data) {
        this.socket.emit('setTyping', data);
    }

    getTyping() {
        return new Observable(observer => {
            this.socket.on('getTyping', msg => {
                // console.log(msg);
                observer.next(msg);
            });
        });
    }

    setSeen(data) {
        this.socket.emit('setSeen', data);
    }

    getSeen() {
        return new Observable(observer => {
            this.socket.on('getSeen', msg => {
                observer.next(msg);
            });
        });
    }

    unreadLastMessages(data) {
        this.socket.emit('unreadLastMessages', data);
    }

    blockUnblockUser(data) {
        this.socket.emit('blockUnblockUser', data);
    }

    getBlockUnblockUser() {
        return new Observable(observer => {
            this.socket.on('getBlockUnblockUser', dt => {
                observer.next(dt);
            });
        });
    }

    setNewPageGroup(data) {
        this.socket.emit('setNewPageGroup', data);
    }

    setNewChatGroup(data) {
        this.socket.emit('setNewChatGroup', data);
    }

    inviteToNewChatGroup(data) {
        this.socket.emit('inviteToNewChatGroup', data);
    }

    inviteToChatGroupSent() {
        return new Observable(observer => {
            this.socket.on('inviteToChatGroupSent', msg => {
                observer.next(msg);
            });
        });
    }

    inviteToNewPageGroup(data) {
        this.socket.emit('inviteToNewPageGroup', data);
    }

    inviteToPageGroupSent() {
        return new Observable(observer => {
            this.socket.on('inviteToPageGroupSent', msg => {
                observer.next(msg);
            });
        });
    }

    acceptJoinToChatGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('acceptJoinToChatGroup', data);
    }

    getAcceptedJoinChatGroup() {
        return new Observable(observer => {
            this.socket.on('acceptedJoinChatGroup', msg => {
                observer.next(msg);
            });
        });
    }

    acceptJoinPageGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('acceptJoinPageGroup', data);
    }

    getAcceptedJoinPageGroup() {
        return new Observable(observer => {
            this.socket.on('acceptedJoinPageGroup', msg => {
                observer.next(msg);
            });
        });
    }

    declineJoinToChatGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineJoinChatGroup', data);
    }

    getDeclinedJoinChatGroup() {
        return new Observable(observer => {
            this.socket.on('getDeclinedJoinChatGroup', msg => {
                observer.next(msg);
            });
        });
    }

    declineJoinPageGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineJoinPageGroup', data);
    }

    getDeclinedJoinPageGroup() {
        return new Observable(observer => {
            this.socket.on('getDeclinedJoinPageGroup', msg => {
                observer.next(msg);
            });
        });
    }

    joinGroup(data) {
        // this.setupSocketConnection();
        this.socket.emit('joinGroup', data);
    }

    getJoinGroup() {
        return new Observable(observer => {
            this.socket.on('getJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }


    confirmJoinGroup(data) {
        this.socket.emit('confirmJoinGroup', data);
    }

    getConfirmedJoinGroup() {
        return new Observable(observer => {
            this.socket.on('confirmedJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }

    ignoreJoinGroup(data) {
        this.socket.emit('ignoreJoinGroup', data);
    }

    getIgnoredJoinGroup() {
        return new Observable(observer => {
            this.socket.on('ignoredJoinGroup', msg => {
                observer.next(msg);
            });
        });
    }


    getChatNotifications() {
        return new Observable(observer => {
            this.socket.on('chatNotification', msg => {
                observer.next(msg);
            });
        });
    }

    leaveChatGroup(data) {
        this.socket.emit('leaveChatGroup', data);
    }

    leaveChatGroupNotify() {
        return new Observable(observer => {
            this.socket.on('leaveChatGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    leavePageGroup(data) {
        this.socket.emit('leavePageGroup', data);
    }

    leavePageGroupNotify() {
        return new Observable(observer => {
            this.socket.on('leavePageGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }

    removeFromPageGroup(data) {
        this.socket.emit('removeFromPageGroup', data);
    }

    removeFromPageGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeFromPageGroupNotify', msg => {
                console.log('remove from group')
                observer.next(msg);
            });
        });
    }

    removeFromChatGroup(data) {
        this.socket.emit('removeFromChatGroup', data);
    }

    removeFromChatGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeFromChatGroupNotify', msg => {
                console.log('remove from group')
                observer.next(msg);
            });
        });
    }

    removeGroup(data) {
        this.socket.emit('removeGroup', data);
    }

    removeGroupNotify() {
        return new Observable(observer => {
            this.socket.on('removeGroupNotify', msg => {
                observer.next(msg);
            });
        });
    }


    acceptConnection(data) {
        // this.setupSocketConnection();
        console.log(data);
        this.socket.emit('acceptConnection', data);
    }

    declineConnection(data) {
        // this.setupSocketConnection();
        this.socket.emit('declineConnection', data);
    }

    acceptedConnection() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('acceptedConnection', msg => {
                console.log('accept');
                observer.next(msg);
            });
        });
    }

    declinedConnection() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('declinedConnection', msg => {
                observer.next(msg);
            });
        });
    }

    cancelUsersConnecting(data) {
        this.socket.emit('cancelUsersConnection', data);
    }

    cancelledUsersConnecting() {
        // this.setupSocketConnection();
        return new Observable(observer => {
            this.socket.on('cancelledUsersConnection', msg => {
                observer.next(msg);
            });
        });
    }

    sendMakeAdminRequest(data) {
        this.socket.emit('sendMakeAdminRequest', data);
    }

    getMakeAdminRequest() {
        return new Observable(observer => {
            this.socket.on('getMakeAdminRequest', msg => {
                observer.next(msg);
            });
        });
    }

    acceptPageGroupAdminRequest(data) {
        this.socket.emit('acceptPageGroupAdminRequest', data);
    }

    getAcceptedPageGroupAdminRequest() {
        return new Observable(observer => {
            this.socket.on('getAcceptedPageGroupAdminRequest', msg => {
                observer.next(msg);
            });
        });
    }

    declinePageGroupAdminRequest(data) {
        this.socket.emit('declinePageGroupAdminRequest', data);
    }

    getDeclinedPageGroupAdminRequest() {
        return new Observable(observer => {
            this.socket.on('getDeclinedPageGroupAdminRequest', msg => {
                observer.next(msg);
            });
        });
    }

    removePageGroupAdminPrivileges(data) {
        this.socket.emit('removePageGroupAdminPrivileges', data);
    }

    getRemovedPageGroupAdminPrivileges() {
        return new Observable(observer => {
            this.socket.on('getRemovedPageGroupAdminPrivileges', msg => {
                observer.next(msg);
            });
        });
    }

    postAdded(data) {
        this.socket.emit('postAdded', data);
    }

    getPostAdded() {
        return new Observable(observer => {
            this.socket.on('getPostAdded', msg => {
                observer.next(msg);
            });
        });
    }

    disconnect(data) {
        this.socket.emit('forceDisconnect', data);
    }

    onLogout() {
        return new Observable(observer => {
            this.socket.on('onLogout', msg => {
                observer.next(msg);
            });
        });
    }

    subscribeChanel(data) {
        this.socket.emit('subscribeChanel', data);
    }

    getSubscribeChanel() {
        return new Observable(observer => {
            this.socket.on('getSubscribeChanel', msg => {
                observer.next(msg);
            });
        });
    }

}
