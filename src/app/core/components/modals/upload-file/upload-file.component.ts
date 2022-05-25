import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_URL } from '@core/constants/global';
import { PostsService } from '@core/services/posts.service';
import { VideoService } from '@core/services/video.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

    title = 'Upload File';

    srcImg;
    showUploadImg = false;
    percentProgressBar = 0;
    fileName = [];
    typeFile = [];
    countUploadFile;
    files = [];
    type;
    showProgressBar = true;
    apiURL = API_URL;

  constructor(
      public dialogRef: MatDialogRef<UploadFileComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private postsServices: PostsService,
      private uploadFile: VideoService
  ) { }

  ngOnInit(): void {
      console.log(this.data);
      this.type = this.data.type;
      this.countUploadFile = this.data.countUploadFile;
      console.log(this.type);
      console.log(this.countUploadFile);
      if (this.data.post) {
          this.title = 'Edit Post';
          this.showProgressBar = false;
          const post = this.data.post;
          const obj = {
              name: post.cover_img,
              type: '',
              src: ''
          };
          if (post.cover_img.includes('image')) {
              obj.type = 'image';
              obj.src = this.apiURL + 'uploads/' + obj.type + 's/' + post.cover_img;
          }
          if (post.cover_img.includes('video')) {
              obj.type = 'video';
              obj.src = this.apiURL + 'uploads/' + obj.type + 's/' + post.cover_img;
          }
          this.files.push(obj);
          this.showUploadImg = true;
          console.log(this.files);
      }
  }


    videoUpload(event): any {
        this.showProgressBar = true;
        this.files = [];
        this.percentProgressBar = 0;
        this.showUploadImg = true;
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
                if (this.type === 'image') {
                    this.dialogRef.close('Upload images');
                }
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
        console.log(this.files);
    }

    progressPercent(e) {
        const loaded = e.loaded;
        const total = e.total;
        this.percentProgressBar = Number(((loaded / total) * 100).toFixed());
    }

    saveFile() {
        if (this.data.post) {
            if (this.files[0]?.file === undefined) {
                return this.dialogRef.close('not edit');
            }
            console.log(this.files);
            console.log(this.data.post);
            const obj = {
                id: this.data.post.id,
                group_id: this.data.post.group_id,
                description: this.data.post.description,
                cover_img: this.data.post.cover_img
            };
            const fd = new FormData();
            let type = '';
            this.files.forEach((elem) => {
                if (elem.type.includes('image')) {
                    fd.append('image', elem.file);
                    type = 'image';
                }
                if (elem.type.includes('video')) {
                    fd.append('video', elem.file);
                    type = 'video';
                }
                fd.append('belonging', 'post_img');
                fd.append('duration', elem.duration);
            });
            this.uploadFile.uploadFile(fd, type).subscribe((dt) => {
                console.log(dt);
                obj.cover_img = dt.path;
                this.postsServices.editPosts(obj).subscribe((data) => {
                    console.log(data);
                });
            });
            return this.dialogRef.close();
        }
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
