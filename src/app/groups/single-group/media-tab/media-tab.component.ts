import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-media-tab',
  templateUrl: './media-tab.component.html',
  styleUrls: ['./media-tab.component.scss']
})
export class MediaTabComponent implements OnInit {

    @Input() selectedGroup;
    @Input() isOwnGroup;

    constructor() {
    }

    ngOnInit(): void {
        // console.log(this.selectedGroup)
    }
}
