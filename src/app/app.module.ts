import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from '@core/helpers/http.interceptor';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@core/modules/material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxStripeModule } from 'ngx-stripe';
import { STRIPE_PUBLISHABLE_KEY } from '@core/constants/global';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { SharedModule } from '@shared/shared.module';
import { NewVideosListPlayerComponent } from '@app/users/new-videos-list-player/new-videos-list-player.component';
import { AddVideoPlaylistComponent } from '@app/users/new-videos-list-player/add-video-playlist';

// Token getter for JWT module
export function tokenGetter() {
    return localStorage.getItem('token') || '';
}

@NgModule({
    declarations: [
        AppComponent,
        NewVideosListPlayerComponent,
        AddVideoPlaylistComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        MatDialogModule,
        MaterialModule,
        NgxChartsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                whitelistedDomains: ['localhost:3000', 'localhost:3001', 'metl.tv'],
                blacklistedRoutes: ['localhost:3000/auth/', 'localhost:3001/auth/', 'metl.tv/auth/']
            }
        }),
        // UsersModule,
        NgxStripeModule.forRoot(STRIPE_PUBLISHABLE_KEY),
        SharedModule
    ],
    entryComponents:[
        AddVideoPlaylistComponent
    ],
    providers: [
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        },
        CurrencyPipe,
        {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}},
        // {provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
