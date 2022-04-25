import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'getUriParts'
})
export class GetUriPartsPipe implements PipeTransform {

    transform(url: string, ...args: unknown[]): {
        scheme: string | undefined,
        host: string,
        port: string | undefined,
        pathname: string,
        hostName: string
    } {
        const matches = url.match(/^(\w+?:\/\/)?([\w-\.]+(?=\/?))?:?(\d*)?([^:]*)/)
        const parts = {
            scheme: matches ? matches[1] : undefined,
            host: matches ? matches[2] : '',
            port: matches ? matches[3] : undefined,
            pathname: matches ? matches[4] : ''
        };
        const hostName = parts.scheme + '' + parts.host + (parts.port ? ':' + parts.port : '') + '/';
        return {...parts, ...{hostName}};
    }

}
