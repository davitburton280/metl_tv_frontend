import { NgModule } from '@angular/core';
import { AppNewVideoListComponent } from '@shared/components/new-video-list/new-video-list.component';
import { CommonModule } from '@angular/common';
import { AppNewVideoListItemComponent } from '@shared/components/new-video-list/new-video-list-item';
import { AppNewVideoListSkeletonComponent } from '@shared/components/new-video-list/new-video-list-skeleton';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [
        AppNewVideoListComponent,
        AppNewVideoListItemComponent,
        AppNewVideoListSkeletonComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
    exports: [
        AppNewVideoListComponent,
        AppNewVideoListItemComponent,
        AppNewVideoListSkeletonComponent
    ]
})

export class NewVideoListModule {
}
