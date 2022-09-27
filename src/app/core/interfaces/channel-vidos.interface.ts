import { GroupItemInterface } from '@core/interfaces/group.interface';

export interface ChannelVidosInterface {
    data: ChannelVidosDataInterface;
    message: string;
}

export interface ChannelVidosDataInterface {
    list: ChannelVidosDataListInterface[];
    totalCount: number;
}

export interface ChannelVidosDataListInterface {
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
    privacy_id: number;
    session_name: string;
    status: string;
    thumbnail: string;
    token: string;
    updated_at: string;
    views: number;
}


export interface ChannelCategoryInterface {
    id: number;
    name: string;
}

export interface ChannelVideosInitialStateInterface {
    channelVideo: ChannelVidosDataListInterface[] | undefined;
    loading: boolean;
}
