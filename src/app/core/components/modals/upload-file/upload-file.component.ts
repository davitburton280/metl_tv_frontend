import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

    srcImg;
    fd = new FormData();
    shoeUploadImg = false;
    percentProgressBar = 0;
    fileName = [];
    typeFile = [];
    countUploadFile;
    files = [];

  constructor(
      public dialogRef: MatDialogRef<UploadFileComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
      console.log(this.data);
      this.countUploadFile = this.data.countUploadFile;
  }


    videoUpload(event): any {
        this.files = [];
        this.percentProgressBar = 0;
        this.shoeUploadImg = true;
        for (let i = 0; i < event.target.files.length; i++) {
            const fl = event.target.files[i];
            const obj = {
                index: i,
                file: fl,
                name: fl.name,
                type: fl.type,
                src: '',
                duration: null
            };
            this.fileName.push(fl.name);
            this.typeFile.push(fl.type);
            this.files.push(obj);
            if (fl.type.includes('video')) {
                // tslint:disable-next-line:prefer-for-of
                const audio = new Audio();
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result.toString().length;
                    const bytes = new ArrayBuffer(data);
                    audio.src = e.target.result.toString();
                    audio.addEventListener('loadedmetadata', () => {
                        console.log(audio.duration);
                        this.files[i].duration = audio.duration;
                        // @ts-ignore
                        // this.fd.append('video', obj);
                    }, false);
                    this.progressPercent(e);
                };
                reader.readAsDataURL(fl);
            }
            console.log(fl.type.includes('image'));
            if (fl.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.srcImg = e.target.result.toString();
                    this.files[i].src = e.target.result.toString();
                    // @ts-ignore
                    // this.fd.append('image', obj);
                    this.progressPercent(e);
                };
                reader.readAsDataURL(fl);
            }
        }
    }

    progressPercent(e) {
        const loaded = e.loaded;
        const total = e.total;
        this.percentProgressBar = Number(((loaded / total) * 100).toFixed());
    }

    saveFile() {
        this.dialogRef.close(this.files);
    }

    canselFile(file, i) {
        this.files = this.files.filter((elem) => elem.index !== this.files[i].index);
        console.log(this.files);
    }

    closedModal() {
        this.dialogRef.close();
    }

}
