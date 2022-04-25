import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import trackByElement from '@core/helpers/track-by-element';
@Component({
    selector: 'app-stocks-lists-tabs',
    templateUrl: './stocks-lists-tabs.component.html',
    styleUrls: ['./stocks-lists-tabs.component.scss']
})
export class StocksListsTabsComponent implements OnInit {
    activeTab;
    trackByElement = trackByElement;

    @Input('defaultTab') defaultTab;
    @Input('tabsList') tabsList;
    @Output('tabChanged') tabChanged = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
        this.activeTab = this.defaultTab;
    }

    changeTab(tab) {
        this.activeTab = tab;
        this.tabChanged.emit(tab);
    }

}
