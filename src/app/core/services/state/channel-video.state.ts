import { BaseState } from '@core/services/state/base.state';
import { ChannelVideosInitialStateInterface, ChannelVidosDataListInterface } from '@core/interfaces/channel-vidos.interface';


export const channelVideosInitialState: ChannelVideosInitialStateInterface = {
    channelVideo: undefined,
    loading: false
};

export class ChannelVideoState extends BaseState<ChannelVideosInitialStateInterface> {
    constructor(initialInputData: any = channelVideosInitialState) {
        super(initialInputData);
    }


    setChannelVideos(channelVideos: ChannelVidosDataListInterface[]): void {
        this.setState({
            ...this.state,
            channelVideo: [
                ...channelVideos
            ]
        });
    }


    updatePrivate(idVideo: number, idPrivate: number): void {
        const data = this.state.channelVideo.map((i: any) => {
            if (i.id === idVideo) {
                console.log( i.privacy_id ,"Prev");
                i.privacy_id = idPrivate;
                console.log( i.privacy_id ,"Success");
            }
            return { ...i };
        });
        this.setState({
            ...this.state,
            channelVideo: [
                ...data
            ]
        });

    }


    deleteVideo(id: number): void {
        const data = this.state.channelVideo.filter((i: any) => i.id !== id);
        this.setState({
            ...this.state,
            channelVideo: [
                ...data
            ]
        });
    }



    setLoading(loading: boolean): void {
        this.setState({
            ...this.state,
            loading
        });
    }

}

