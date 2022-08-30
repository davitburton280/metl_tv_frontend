import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupsService} from '@core/services/groups.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RemuveType} from '@app/groups/dialogs/helper/remuveType';

@Component({
    selector: 'app-delete-group-dialog',
    templateUrl: 'delete-group.dialog.html',
    styleUrls: ['delete-group.dialog.scss']
})

export class DeleteGroupDialog implements OnInit, OnDestroy {
    public deleteGroupForm: FormGroup;
    private typeEnum = RemuveType;
    public nextStep = false;
    public textChangeType = this.typeEnum.irrevocably;

    constructor(
        private _fb: FormBuilder,
        private dialogRef: MatDialogRef<any>,
        private _groupsService: GroupsService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit() {
        this._formBuilder();
        this.changeValueRadioButton();
    }

    private _formBuilder(): void {
        this.deleteGroupForm = this._fb.group({
            deleteOption: [1, Validators.required]
        });
    }

    public nextStepTrue() {
        this.nextStep = true;
    }

    public prevStepFalse() {
        this.nextStep = false;
    }

    public closeDialog() {
        this.dialogRef.close();
    }

    public remuveGroupByType() {
        if (this.deleteGroupForm.invalid) {
            return;
        }

        const remuveData = {
            type: this.deleteGroupForm.get('deleteOption').value,
            id: this.data
        };
        this._groupsService.remuveGroupByTypeAndGroupId(remuveData);
    }

    public changeValueRadioButton() {
        this.deleteGroupForm.get('deleteOption').valueChanges
            .subscribe((data) => {
                console.log(data, 1213);
                if (data === 1) {
                    this.textChangeType = this.typeEnum.irrevocably;
                }
                this.textChangeType = this.typeEnum.removeMembers;
                console.log(this.textChangeType);
            });

    }

    ngOnDestroy() {
    }
}
