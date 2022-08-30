import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from '@shared/models/stock';
import {SubjectService} from '@core/services/subject.service';
import {STOCK_TILE_CHART_SETTINGS} from '@core/constants/charts';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {IsStockFollowedPipe} from '@shared/pipes/is-stock-followed.pipe';
import trackByElement from '@core/helpers/track-by-element';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-stock-tiles',
    templateUrl: './stock-tiles.component.html',
    styleUrls: ['./stock-tiles.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockTilesComponent implements OnInit {
    @Input('stocks') passedStocks: Stock[] = [];
    @Input('userStocks') userStocks: Stock[] = [];
    @Input('type') selectedStockType: Stock | null = null;
    @Input('allStocksList') allStocksList = false;
    @Input('dragDropDisabled') dragDropDisabled = false;
    @Input('followingAllowed') followingAllowed = true;
    @Input('stockProfileAllowed') stockProfileAllowed = false;
    @Output('updatedStocksList') updatedStocksList = new EventEmitter();
    @Output('updatedStocksPriority') updatedStocksPriority = new EventEmitter();
    stockChartSettings = STOCK_TILE_CHART_SETTINGS;
    authUser: CurrentUserData;
    trackByElement = trackByElement;
    constructor(
        private subject: SubjectService,
        private updateStocks: UpdateUserStocksPipe,
        // private getAuthUser: GetAuthUserPipe,
        private _userInfoService: UserInfoService,
        private isStockFollowed: IsStockFollowedPipe,
        public router: Router
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Stock Tiles  AUTHUSER DATA');
        });
    }

    updateFollowedStocksList(stock) {
        const result = this.updateStocks.transform(this.userStocks, stock, this.isStockFollowed.transform(this.userStocks, stock));
        if (result) {
            if (!this.allStocksList) {
                this.passedStocks = result;
            }
            this.updatedStocksList.emit(result);
        }
    }

    drop(event: CdkDragDrop<any>) {
        this.passedStocks[event.previousContainer.data.index] = event.container.data.item;
        this.passedStocks[event.container.data.index] = event.previousContainer.data.item;

        this.updatedStocksPriority.emit(this.passedStocks);
    }

    openStockProfile(stock) {
        if (this.stockProfileAllowed) {
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
                await this.router.navigate([`stocks/${stock}/analytics`])
            );
        }
    }
}
