import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  OpenVidu,
  Publisher,
  Session,
  SessionDisconnectedEvent,
  StreamEvent,
  StreamManager,
  Subscriber
} from 'openvidu-browser';
import {OpenviduService} from '@core/services/openvidu.service';
import {ToastrService} from 'ngx-toastr';
import {OpenViduLayout, OpenViduLayoutOptions, OpenviduSessionComponent, OvSettings, UserModel} from 'openvidu-angular';

@Component({
  selector: 'app-video-library',
  templateUrl: './video-library.component.html',
  styleUrls: ['./video-library.component.scss']
})
export class VideoLibraryComponent implements OnInit {

  joinSessionForm: FormGroup;

  OPENVIDU_SERVER_URL = 'https://localhost/:4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  // Join form
  mySessionId = 'SessionA';
  myUserName = 'Participant' + Math.floor(Math.random() * 100);
  tokens: string[] = [];
  session = false;

  ovSession: Session;
  ovLocalUsers: UserModel[];
  ovLayout: OpenViduLayout;
  ovLayoutOptions: OpenViduLayoutOptions;

  @ViewChild('ovSessionComponent')
  public ovSessionComponent: OpenviduSessionComponent;

  constructor(
    private fb: FormBuilder,
    private openViduService: OpenviduService,
    private toastr: ToastrService,
    private elRef: ElementRef,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.joinSessionForm = this.fb.group({
      mySessionId: ['SessionB'],
      myUserName: ['Participant' + Math.floor(Math.random() * 100)]
    });
  }

  async joinSession() {
    this.getToken();
  }

  getToken() {
    this.openViduService.getToken({email: 'admin@gmail.com', sessionName: 'SessionA'}).subscribe((token: any) => {
        console.log(token);
        this.tokens.push(token);
        this.session = true;
        console.log('getToken ', this.tokens);
    },
        (err) => {
            console.log(err);
        });
  }


  leaveSession() {

  }

  handlerSessionCreatedEvent(session: Session): void {

    // You can see the session documentation here
    // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/session.html

    console.log('SESSION CREATED EVENT', session);

    session.on('streamCreated', (event: StreamEvent) => {
      console.log('stream created!!!')
      // Do something
    });

    session.on('streamDestroyed', (event: StreamEvent) => {
      // Do something
    });

    session.on('sessionDisconnected', (event: SessionDisconnectedEvent) => {
      this.session = false;
      this.tokens = [];
    });

    // this.myMethod();


  }

  handlerPublisherCreatedEvent(publisher: Publisher) {

    // You can see the publisher documentation here
    // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/publisher.html

    publisher.on('streamCreated', (e) => {
      console.log('Publisher streamCreated', e);
    });

  }

  handlerErrorEvent(event): void {
    // Do something
    console.log('error', event)
  }

  myMethod() {
    this.ovLocalUsers = this.ovSessionComponent.getLocalUsers();
    this.ovLayout = this.ovSessionComponent.getOpenviduLayout();
    this.ovLayoutOptions = this.ovSessionComponent.getOpenviduLayoutOptions();
  }

  ngOnDestroy(): void {
    // On component destroyed leave session
    this.leaveSession();
  }

}
