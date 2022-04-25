import { Injectable } from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {

  constructor(private httpClient: HttpClient) { }

    getChatMessages(params) {
        return this.httpClient.get<any>(`${API_URL}chat/video/get-messages`, {params});
    }

    saveVideoMessage(params) {
        return this.httpClient.post<any>(`${API_URL}chat/video/save-message`, params);
    }
}
