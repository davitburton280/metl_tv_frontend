import { EventEmitter, Injectable, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    @Output() liveVideoRefresh: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private httpClient: HttpClient
    ) {
    }

    get(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get`, { params });
    }

    uploadFile(fd, type) {
        return this.httpClient.post<any>(`${API_URL}upload/` + type, fd);
    }

    deleteFile(filename, type) {
        const options = {body: {file: filename}};
        // @ts-ignore
        return this.httpClient.delete<any>(`${API_URL}file/` + type, options);
    }

    saveVideoToken(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-token`, params);
    }

    updateParticipantsCount(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-streaming-participants-count`, params);
    }

    saveVideoThumbnail(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-thumbnail`, params);
    }

    removeVideoThumbnail(params) {
        console.log(params);
        return this.httpClient.delete<any>(`${API_URL}videos/remove-video-thumbnail?` + params);
    }

    removeVideo(params) {
        return this.httpClient.delete<any>(`${API_URL}videos/remove`, {params});
    }

    removeVideoByToken(params) {
        return this.httpClient.delete<any>(`${API_URL}videos/remove-by-token`, {params});
    }

    saveRecordedData(params) {
        return this.httpClient.post<any>(`${API_URL}videos/save-video-data`, params);
    }

    // saveVideoMessage(params) {
    //     return this.httpClient.post<any>(`${API_URL}videos/save-video-message`, params);
    // }

    getVideoCategories() {
        return this.httpClient.get<any>(`${API_URL}videos/get-categories`, {});
    }

    getVideoTags() {
        return this.httpClient.get<any>(`${API_URL}videos/get-all-tags`, {});
    }

    getUserVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-user-videos`, {params});
    }

    getUserSavedVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-saved`, {params});
    }


    getVideoById(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-video-by-id`, {params});
    }

    getVideosByAuthor(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-videos-by-author`, {params});
    }

    searchInUserVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/search-in-user-videos`, {params});
    }

    searchInAllVideos(params) {
        return this.httpClient.get<any>(`${API_URL}videos/search-in-all-videos`, {params});
    }

    updateLikes(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-likes`, params);
    }

    updateViews(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-views`, params);
    }

    updatePrivacy(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-privacy`, params);
    }



    indexUserTags(params) {
        return this.httpClient.put<any>(`${API_URL}videos/index-user-tags`, params);
    }

    saveVideo(params) {
        return this.httpClient.put<any>(`${API_URL}videos/save-video`, params);
    }

    saveVideoDetails(params) {
        return this.httpClient.put<any>(`${API_URL}videos/save-video-details`, params);
    }

    getUserTags(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-user-tags`, {params});
    }

    getVideoComments(params) {
        return this.httpClient.get<any>(`${API_URL}videos/get-comments`, {params});
    }

    addVideoComment(params) {
        return this.httpClient.post<any>(`${API_URL}videos/add-comment`, params);
    }

    updateVideoComment(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-comment`, params);
    }

    removeVideoComment(params) {
        return this.httpClient.delete<any>(`${API_URL}videos/remove-comment`, {params});
    }

    updateCommentLikes(params) {
        return this.httpClient.put<any>(`${API_URL}videos/update-comment-likes`, params);
    }
}
