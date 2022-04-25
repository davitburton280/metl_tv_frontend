import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getSelectedVideosToBeAddedToPlaylist'
})
export class GetSelectedVideosToBeAddedToPlaylistPipe implements PipeTransform {

  transform(video: any, selectedVideos: any[], playlist): any {
      const id = video.id;
      if (selectedVideos.includes(id)) {
          selectedVideos = selectedVideos.filter(v => v !== id);
      } else if (!this.checkIfVideoAddedToPlaylist(video, playlist)) {
          selectedVideos.push(id);
      }
      return selectedVideos;
  }

    checkIfVideoAddedToPlaylist(video, playlist) {
        return video?.playlists?.find(p => playlist.id === p.id);
    }

}
