import { TagVideoInterface } from '@core/interfaces/new-vidos.interface';

export interface NewPlaylistInterface {
    channel: any;
    channelId: number;
    channel_id: number;
    created_at: string;
    description: string;
    id: number;
    name: string;
    privacy: number;
    thumbnail: string;
    updated_at: string;
    videos: NewPlayListVideo[] | [];
}

export interface NewPlayListVideo {
    author_id: number;
    category_id: number;
    channel_id: number;
    created_at: string;
    description: string;
    dislikes: number;
    duration: string;
    duration_miliseconds: number;
    filename: string;
    id: number;
    likes: number;
    name: string;
    participants: number;
    playlists_videos: { playlist_id: number, video_id: number, channel_id: any, position: number };
    privacy_id: number;
    session_name: string | null;
    status: string;
    tags: TagVideoInterface[];
    thumbnail: string;
    token: any;
    updated_at: string;
    views: number;
}


export interface NewPlayListInitialState {
    playLists: NewPlaylistInterface[];
    loading: boolean;
}


export interface NewPlayListVideosInitialState {
    videos: NewPlaylistInterface;
    loading: boolean;
}
