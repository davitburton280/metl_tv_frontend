import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fixLineBreaks'
})
export class FixTextLineBreaksPipe implements PipeTransform {

    transform(d: string, textareaControl = null, replaceValue = '\n'): string {
        let replacedText = d?.replace(/<br\s*[\/]?>/gi, replaceValue);
        if (textareaControl) {

            const startPosition = textareaControl.selectionStart;
            const endPosition = textareaControl.selectionEnd;

            if (startPosition === endPosition) {
                const stringArr = [...replacedText];
                stringArr[startPosition - 1] = '';
                replacedText = stringArr.join('');
            }

        }
        return replacedText;
    }

}
