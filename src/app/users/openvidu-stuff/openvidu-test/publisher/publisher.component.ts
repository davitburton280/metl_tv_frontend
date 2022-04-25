import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OpentokService} from '@core/services/opentok.service';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit, AfterViewInit {

  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;
  @Output() shareScreen = new EventEmitter();
  publisher: OT.Publisher;
  publishing: boolean;
  playerOptions = {
    autoplay: true,
    html5: {
      vhs: {
        overrideNative: true,
        withCredentials: true
      }
    },
    liveui: true,
    controls: true,
    fluid: false,
    sources: [{src: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4'}]
  }

  constructor(private opentokService: OpentokService) {
    this.publishing = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append'});
    if (this.session) {
      // if (this.session['isConnected']()) {
      //   this.publish();
      // }
      this.session.on('sessionConnected', () => this.publish());
    }
  }

  publish() {
    this.session.publish(this.publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.publishing = true;
      }
    });
  }


  screenShare() {
    this.shareScreen.emit();
  }


}
