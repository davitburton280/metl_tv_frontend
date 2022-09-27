import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomeComponent} from './users/home/home.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {NonAuthGuard} from '@core/guards/non-auth.guard';
import {NotFoundComponent} from '@core/components/docs/not-found/not-found.component';
import {AccessibilityStatementComponent} from '@app/core/components/docs/accessibility-statement/accessibility-statement.component';
import {AboutComponent} from '@core/components/docs/about/about.component';
import {CookiePolicyComponent} from '@core/components/docs/cookie-policy/cookie-policy.component';
import {PrivacyPolicyComponent} from '@core/components/docs/privacy-policy/privacy-policy.component';
import {SecurityComponent} from '@core/components/docs/security/security.component';
import {HelpComponent} from '@core/components/docs/help/help.component';
import {ContactUsComponent} from '@core/components/docs/contact-us/contact-us.component';
import {PageLoadingComponent} from '@core/components/docs/page-loading/page-loading.component';
import {PaymentSuccessComponent} from '@app/users/payment-success/payment-success.component';
import {PaymentCancelComponent} from '@app/users/payment-cancel/payment-cancel.component';
import { NewHomeComponent } from '@app/users/new-home/new-home.component';


const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent,
    //     data: {
    //         title: 'Metl TV',
    //     }
    // },
    {
        path: '',
        component: NewHomeComponent,
        data: {
            title: 'Metl TV',
        }
    },
    {
        path: 'channels',
        loadChildren: () => import('./channels/channels.module').then(m => m.ChannelsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'channel',
        loadChildren: () => import('./channel/channel.module').then(it => it.ChannelModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
        canActivate: [NonAuthGuard]
    },
    {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'stocks',
        loadChildren: () => import('./stocks/stocks.module').then(m => m.StocksModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'videos',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
    },
    {
        path: 'trending',
        loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
    },
    {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'groups',
        loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'playlists',
        loadChildren: () => import('./playlists/playlists.module').then(m => m.PlaylistsModule),
    },
    {
        path: 'wallet',
        loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'posts',
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'about-us',
        component: AboutComponent,
        data: {
            title: 'About',
        }
    },
    {
        path: 'help',
        component: HelpComponent,
        data: {
            title: 'Help',
        }
    },
    {
        path: 'cookie-policy',
        component: CookiePolicyComponent,
        data: {
            title: 'Cookie policy',
        }
    },
    {
        path: 'accessibility-assessment',
        component: AccessibilityStatementComponent,
        data: {
            title: 'Accessibility statement',
        }
    },
    {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
            title: 'Contact us',
        }
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
            title: 'Privacy policy',
        }
    },
    {
        path: 'security',
        component: SecurityComponent,
        data: {
            title: 'Security',
        }
    },
    {
        path: 'test',
        component: PageLoadingComponent,
        data: {
            title: 'Security',
        }
    },
    {
        path: 'payment-success',
        component: PaymentSuccessComponent
    },
    {
        path: 'payment-cancel',
        component: PaymentCancelComponent
    },
    {
        path: 'turbo-plan',
        loadChildren: () => import('./chanel-subscription/chanel-subscription.module').then(m => m.ChanelSubscriptionModule),
        canActivate: [AuthGuard]
    },

    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
