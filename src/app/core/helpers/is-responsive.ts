export default class IsResponsive {
    static check() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isSmallScreen() {
        return window.screen.availWidth <= 991;
    }

    static isChatUsersListSize() {
        return window.screen.availWidth <= 1111;
    }


}
