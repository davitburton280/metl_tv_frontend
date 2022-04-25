import {Component, Input, OnInit} from '@angular/core';
import {StreamManager} from 'openvidu-browser';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-video',
  templateUrl: './user-video.component.html',
  styleUrls: ['./user-video.component.scss']
})
export class UserVideoComponent implements OnInit {


  @Input() streamManager: StreamManager;

  constructor(
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  getNicknameTag() { // Gets the nickName of the users
    const from = JSON.parse(this.streamManager.stream.connection.data.replace(/}%\/%{/g, ','));
    // this.toastr.success(from.clientData.myUserName + 'joined the session');
    // console.log(from)
    return from.clientData.myUserName;
    // console.log(this.streamManager.stream.connection.data)
    // const streamData = JSON.parse(this.streamManager.stream.connection.data);
  }

}
