import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from '@app/app.module';
import {environment} from '@env';
import {UserInfoService} from '@core/services/user-info.service';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    // .then(ref => {
    //     const configService = ref.injector.get(UserInfoService);
    //     console.log(configService._userInfo.subscribe(data => console.log(data, 'CURENT USER')));
    // })
    .catch(err => console.error(err));
