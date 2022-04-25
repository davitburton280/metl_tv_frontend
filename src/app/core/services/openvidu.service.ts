import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
  providedIn: 'root'
})
export class OpenviduService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getToken(params) {
    return this.httpClient.get(`${API_URL}users/session/get-token`, {params});
    // return this.httpClient.post(`${API_URL}api/sessions`, {params});
  }

  getSession() {
    return this.httpClient.post(`${API_URL}api/sessions`, {});
  }

  leaveSession(params){
    return this.httpClient.get(`${API_URL}users/session/leave`, {params});
  }
}
