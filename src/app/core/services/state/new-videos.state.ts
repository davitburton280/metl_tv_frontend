import { BaseState } from '@core/services/state/base.state';
import { NewVideoStateInitial, NewVidosItemInterface } from '@core/interfaces/new-vidos.interface';


export const newVideos: NewVideoStateInitial = {
    videos: undefined,
    loading: false,
    count: 1
};

export class NewVideosState extends BaseState<NewVideoStateInitial> {
    constructor(initialInputData: any = newVideos) {
        super(initialInputData);
    }


    setVideos(videos: NewVidosItemInterface[], count: number): void {
        console.log(videos, 'videos');
        this.setState({
            ...this.state,
            videos: [
                ...videos
            ],
            count
        });
    }

    setLoading(loading: boolean): void {
        this.setState({
            ...this.state,
            loading
        });
    }

}

