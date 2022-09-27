import { CurrentUserData } from '@core/interfaces/currentUser.interface';

export interface NewVidosInterface {
    data: {
        count: number;
        list: NewVidosItemInterface[];
    };
}

export interface NewVidosItemInterface {
    author_id: number;
    category: { id: number, name: string };
    category_id: number;
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
    session_name: any;
    status: string;
    tag: TagVideoInterface[];
    thumbnail: string;
    token: any;
    updated_at: string;
    user: CurrentUserData;
    views: number;
}

export interface TagVideoInterface {
    id: number;
    name: string;
    video_tags: { video_id: number, tag_id: number };
}


export interface NewVideoStateInitial {
    videos: NewVidosItemInterface[];
    loading: boolean;
    count: number | undefined;
}
