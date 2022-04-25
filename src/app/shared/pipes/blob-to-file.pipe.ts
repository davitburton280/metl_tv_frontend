import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'blobToFile'
})
export class BlobToFilePipe implements PipeTransform {

  transform(theBlob): File {
    return new File([theBlob], theBlob.name);
  }

}
