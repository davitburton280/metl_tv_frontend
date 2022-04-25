import {Directive, Injector, Input, Self} from '@angular/core';

@Directive({
    selector: '[disableControl]'
})
export class DisableControlProperlyDirective {

    @Input() set disableControl({condition, control}) {
        const action = condition ? 'disable' : 'enable';
        control?.[action]();
    }


}
