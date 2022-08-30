import {Component, Input, OnInit} from '@angular/core';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';
import {DeleteGroupDialog} from '@app/groups/dialogs';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-group-item',
    templateUrl: './group-item.component.html',
    styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {
    @Input() group;

    constructor(
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe,
        private _dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    public openDeleteDialog() {
        this._dialog.open(DeleteGroupDialog, {
            height: '400px',
            width: 'auto',
            data: this.group.id,
        }).afterClosed().subscribe(dt => {

        });
    }

    getUrl() {
        const url = '/groups/' + this.group.id.replace(' /g', '_') + '/about';
        return this.lowerCaseRemoveSpaces.transform(url);
    }

}
