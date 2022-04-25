function buildPlayVideoRoute(video, username) {
    let route;
    let params;
    if (video.status === 'live') {
        route = 'users/video/watch';
        params = {session: video.session_name, publisher: username, id: video.id};
    } else {
        route = 'videos/play';
        params = {id: video.id};
    }

    return {route, params};
}

export {buildPlayVideoRoute as buildPlayVideoRoute};
