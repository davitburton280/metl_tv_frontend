import {Component, Input, OnInit} from '@angular/core';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';

@Component({
    selector: 'app-group-item',
    templateUrl: './group-item.component.html',
    styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {
    @Input() group;

    constructor(
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe
    ) {
    }

    ngOnInit(): void {
    }

    getUrl() {
        const url = '/groups/' + this.group.name.replace(' /g', '_') + '/about';
        return this.lowerCaseRemoveSpaces.transform(url);
    }

}
