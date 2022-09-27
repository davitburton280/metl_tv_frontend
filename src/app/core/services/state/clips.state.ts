import { BaseState } from '@core/services/state/base.state';
import { ClipsItemInterface, ClipsStateInitial } from '@core/interfaces/clips.interface';


export const newVideos: ClipsStateInitial = {
    clip: undefined,
    loading: false,
    count: 1
};

export class ClipsState extends BaseState<ClipsStateInitial> {
    constructor(initialInputData: any = newVideos) {
        super(initialInputData);
    }


    setClip(clip: ClipsItemInterface[], count: number): void {
        console.log(clip, 'videos');
        this.setState({
            ...this.state,
            clip: [
                ...clip
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

