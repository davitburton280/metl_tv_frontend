import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoJsComponent} from './components/video-js/video-js.component';
import {VideoJsRecordComponent} from './components/video-js-record/video-js-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatBoxComponent} from './components/chat-box/chat-box.component';
import {GetAuthUserPipe} from './pipes/get-auth-user.pipe';
import {BlobToFilePipe} from './pipes/blob-to-file.pipe';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {MaterialModule} from '@core/modules/material.module';
import {Base64ToFilePipe} from './pipes/base64-to-file.pipe';
import {CategoriesComponent} from '@shared/components/categories/categories.component';
import {FilterDevicesPipe} from './pipes/filter-devices.pipe';
import {GetThumbPathPipe} from './pipes/get-thumb-path.pipe';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from './pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import {VideoFiltersComponent} from '@shared/components/video-filters/video-filters.component';
import {DateFromNowPipe} from './pipes/date-from-now.pipe';
import {FilterOutFalsyValuesFromObjectPipe} from './pipes/filter-out-falsy-values-from-object.pipe';
import {CheckForEmptyObjectPipe} from './pipes/check-for-empty-object.pipe';
import {UserTagsComponent} from './components/user-tags/user-tags.component';
import {VideosListHolderComponent} from './components/videos-list-holder/videos-list-holder.component';
import {StocksListsModalComponent} from './components/stocks-lists-modal/stocks-lists-modal.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {UpdateUserStocksPipe} from './pipes/update-user-stocks.pipe';
import {SearchStocksFormComponent} from '@shared/components/search-stocks-form/search-stocks-form.component';
import {SearchVideosFormComponent} from '@shared/components/search-videos-form/search-videos-form.component';
import {StockTilesComponent} from './components/stocks-tiles/stock-tiles.component';
import {StocksListComponent} from './components/stocks-list/stocks-list.component';
import {IsStockFollowedPipe} from './pipes/is-stock-followed.pipe';
import {FixTextLineBreaksPipe} from './pipes/fix-text-line-breaks.pipe';
import {VideoRegularPlayerComponent} from './components/video-regular-player/video-regular-player.component';
import {StocksMarqueeComponent} from './components/stocks-marquee/stocks-marquee.component';
import {CompletePurchaseModalComponent} from './components/complete-purchase-modal/complete-purchase-modal.component';
import {CreditCardDirectivesModule} from 'angular-cc-library';
import {NgxStripeModule} from 'ngx-stripe';
import {STRIPE_PUBLISHABLE_KEY} from '@core/constants/global';
import {PaymentsFilterFormComponent} from './components/payments-filter-form/payments-filter-form.component';
import {CapitalizeAddSpacesPipe} from './pipes/capitalize-add-spaces.pipe';
import {GetWalletTablesColumnContentsPipe} from './pipes/get-wallet-tables-column-contents.pipe';
import {CountPurchasedTransferredTotalsPipe} from './pipes/count-purchased-transfered-totals.pipe';
import {ConvertToCurrencyPipe} from './pipes/convert-to-currency.pipe';
import {ApplyDiscountToPricePipe} from './pipes/apply-discount-to-price.pipe';
import {MatReusableTableComponent} from './components/mat-reusable-table/mat-reusable-table.component';
import {VideoJsPlayerComponent} from './components/video-js-player/video-js-player.component';
import {NumbersOnlyInputDirective} from '@shared/directives/numbers-only-input.directive';
import {DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule} from 'ngx-dropzone-wrapper';
import {ChatBottomBoxComponent} from './components/chat/direct-chat/chat-bottom-box/chat-bottom-box.component';
import {GroupByPipe} from './pipes/group-by.pipe';
import {GetDateTextForMessagesPipe} from './pipes/get-date-text-for-messages.pipe';
import {GetElegantDatePipe} from './pipes/get-elegant-date.pipe';
import {NotificationsListComponent} from '@shared/components/notifications-list/notifications-list.component';

import {ChatFormComponent} from './components/chat-form/chat-form.component';
import {DirectChatMessagesComponent} from '@shared/components/chat/direct-chat/direct-chat-messages/direct-chat-messages.component';
import {UsersListComponent} from '@shared/components/chat/direct-chat/users-list/users-list.component';
import {GroupsListComponent} from './components/chat/group-chat/left-side/groups-list/groups-list.component';
import {GroupFormComponent} from './components/chat/group-chat/left-side/group-form/group-form.component';
import {GroupChatMessagesComponent} from '@shared/components/chat/group-chat/right-side/group-chat-messages/group-chat-messages.component';
import {GroupChatTopComponent} from './components/chat/group-chat/right-side/group-chat-top/group-chat-top.component';
import {GroupAvatarHandlerComponent} from './components/chat/group-chat/right-side/group-chat-top/group-avatar-handler/group-avatar-handler.component';
import {GroupChatActionsComponent} from './components/chat/group-chat/right-side/group-chat-top/group-chat-actions/group-chat-actions.component';
import {GroupChatMembersComponent} from './components/chat/group-chat/right-side/group-chat-top/group-chat-members/group-chat-members.component';
import {MembersListComponent} from './components/chat/group-chat/right-side/group-chat-top/group-chat-members/members-list/members-list.component';
import {MembersAddFormComponent} from './components/chat/group-chat/right-side/group-chat-top/group-chat-members/members-add-form/members-add-form.component';
import {GroupChatRightSideHolderComponent} from './components/chat/group-chat/right-side/group-chat-right-side-holder.component';
import {GroupChatLeftSideHolderComponent} from '@shared/components/chat/group-chat/left-side/group-chat-left-side-holder.component';
import {GetFileBaseNamePipe} from './pipes/get-file-base-name.pipe';
import {RouterModule} from '@angular/router';
import {LowercaseRemoveSpacesPipe} from './pipes/lowercase-remove-spaces.pipe';
import {GetTwoArrayOfObjectsDifferencePipe} from './pipes/get-two-array-of-objects-difference.pipe';
import {FixGroupPageUrlDirective} from './directives/fix-group-page-url.directive';
import {DisableControlProperlyDirective} from './directives/disable-control-properly.directive';
import {PostItemComponent} from './components/posts/post-item/post-item.component';
import {PostFormPlaceholderComponent} from './components/posts/post-form-placeholder/post-form-placeholder.component';
import {KMNumberFormatterPipe} from './pipes/k-m-number-formatter.pipe';
import {GetUriPartsPipe} from './pipes/get-uri-parts.pipe';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: '{no_url}',
    maxFilesize: 50,
    maxFiles: 1,
    acceptedFiles: 'image/*',
    autoProcessQueue: false,
    addRemoveLinks: true
};

@NgModule({
    declarations: [
        VideoJsComponent,
        VideoJsRecordComponent,
        CategoriesComponent,
        ChatBoxComponent,
        VideoFiltersComponent,
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetThumbPathPipe,
        GetSelectedVideosToBeAddedToPlaylistPipe,
        DateFromNowPipe,
        FilterOutFalsyValuesFromObjectPipe,
        CheckForEmptyObjectPipe,
        UserTagsComponent,
        VideosListHolderComponent,
        StocksListsModalComponent,
        UpdateUserStocksPipe,
        SearchStocksFormComponent,
        SearchVideosFormComponent,
        StockTilesComponent,
        StocksListComponent,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        VideoRegularPlayerComponent,
        StocksMarqueeComponent,
        CompletePurchaseModalComponent,
        PaymentsFilterFormComponent,
        CapitalizeAddSpacesPipe,
        GetWalletTablesColumnContentsPipe,
        CountPurchasedTransferredTotalsPipe,
        ConvertToCurrencyPipe,
        ApplyDiscountToPricePipe,
        MatReusableTableComponent,
        VideoJsPlayerComponent,
        NumbersOnlyInputDirective,
        ChatBottomBoxComponent,
        NotificationsListComponent,
        GroupByPipe,
        GetDateTextForMessagesPipe,
        GetElegantDatePipe,
        ChatFormComponent,
        DirectChatMessagesComponent,
        UsersListComponent,
        GroupsListComponent,
        GroupFormComponent,
        GroupChatMessagesComponent,
        GroupChatTopComponent,
        GroupAvatarHandlerComponent,
        GroupChatActionsComponent,
        GroupChatMembersComponent,
        MembersListComponent,
        MembersAddFormComponent,
        GroupChatRightSideHolderComponent,
        GroupChatLeftSideHolderComponent,
        GetFileBaseNamePipe,
        LowercaseRemoveSpacesPipe,
        GetTwoArrayOfObjectsDifferencePipe,
        FixGroupPageUrlDirective,
        DisableControlProperlyDirective,
        PostItemComponent,
        PostFormPlaceholderComponent,
        KMNumberFormatterPipe,
        GetUriPartsPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PickerModule,
        MaterialModule,
        DragDropModule,
        NgxChartsModule,
        CreditCardDirectivesModule,
        NgxStripeModule.forRoot(STRIPE_PUBLISHABLE_KEY),
        DropzoneModule,
        RouterModule,
    ],
    providers: [
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetSelectedVideosToBeAddedToPlaylistPipe,
        FilterOutFalsyValuesFromObjectPipe,
        CheckForEmptyObjectPipe,
        UpdateUserStocksPipe,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        CapitalizeAddSpacesPipe,
        GetWalletTablesColumnContentsPipe,
        CountPurchasedTransferredTotalsPipe,
        ApplyDiscountToPricePipe,
        GetDateTextForMessagesPipe,
        GroupByPipe,
        GetFileBaseNamePipe,
        GetElegantDatePipe,
        LowercaseRemoveSpacesPipe,
        GetTwoArrayOfObjectsDifferencePipe,
        GetUriPartsPipe,
        KMNumberFormatterPipe,
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        PickerModule,
        MaterialModule,
        NgxStripeModule,
        VideoJsComponent,
        VideoJsRecordComponent,
        ChatBoxComponent,
        CategoriesComponent,
        FilterDevicesPipe,
        GetThumbPathPipe,
        VideoFiltersComponent,
        DateFromNowPipe,
        UserTagsComponent,
        CheckForEmptyObjectPipe,
        CapitalizeAddSpacesPipe,
        VideosListHolderComponent,
        StocksListsModalComponent,
        SearchStocksFormComponent,
        SearchVideosFormComponent,
        StockTilesComponent,
        StocksListComponent,
        IsStockFollowedPipe,
        FixTextLineBreaksPipe,
        GetWalletTablesColumnContentsPipe,
        CountPurchasedTransferredTotalsPipe,
        ConvertToCurrencyPipe,
        ApplyDiscountToPricePipe,
        VideoRegularPlayerComponent,
        StocksMarqueeComponent,
        CompletePurchaseModalComponent,
        PaymentsFilterFormComponent,
        MatReusableTableComponent,
        VideoJsPlayerComponent,
        NumbersOnlyInputDirective,
        DropzoneModule,
        ChatBottomBoxComponent,
        NotificationsListComponent,
        GetDateTextForMessagesPipe,
        GetElegantDatePipe,
        ChatFormComponent,
        DirectChatMessagesComponent,
        UsersListComponent,
        GroupsListComponent,
        GroupFormComponent,
        GroupChatRightSideHolderComponent,
        GroupChatLeftSideHolderComponent,
        MembersListComponent,
        MembersAddFormComponent,
        FixGroupPageUrlDirective,
        DisableControlProperlyDirective,
        PostItemComponent,
        PostFormPlaceholderComponent
    ],
})
export class SharedModule {
}
