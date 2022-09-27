import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[disableControl]'
})
export class DisableControlProperlyDirective {

    @Input() set disableControl({condition, control}) {
        const action = condition ? 'disable' : 'enable';
        control?.[action]();
    }


}
