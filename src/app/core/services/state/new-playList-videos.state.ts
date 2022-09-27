import { BaseState } from '@core/services/state/base.state';


export const newPlaylist: any = {
    videos: {},
    loading: false
};

export class NewPlayListVideosState extends BaseState<any> {
    constructor(initialInputData: any = newPlaylist) {
        super(initialInputData);
    }


    setVideos(video: any): void {
        console.log(video, 'videos');
        this.setState({
            ...this.state,
            videos: {
                ...video
            }
        });
    }


    setLoading(loading: boolean): void {
        this.setState({
            ...this.state,
            loading
        });
    }

}

