import { BaseState } from '@core/services/state/base.state';
import { NewPlayListInitialState, NewPlaylistInterface } from '@core/interfaces/new-playlist.interface';


export const newPlaylist: NewPlayListInitialState = {
    playLists: undefined,
    loading: false
};

export class NewPlaylistState extends BaseState<NewPlayListInitialState> {
    constructor(initialInputData: any = newPlaylist) {
        super(initialInputData);
    }


    setPlayList(playLists: any): void {
        console.log(playLists, 'playLists');
        this.setState({
            ...this.state,
            playLists: [
                ...playLists
            ]
        });
    }


    createPlayList(playListData: any): void {
        this.setState({
            ...this.state,
            playLists: [
                ...this.state.playLists,
                Object.assign(playListData)
            ]
        });
    }

    deletePlayList(id: number): void {
        const data = this.state.playLists.filter((i: any) => i.id !== id);
        this.setState({
            ...this.state,
            playLists: [
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

