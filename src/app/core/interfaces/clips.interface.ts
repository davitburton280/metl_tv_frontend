import { CurrentUserData } from '@core/interfaces/currentUser.interface';
import { NewVidosItemInterface, TagVideoInterface } from '@core/interfaces/new-vidos.interface';

export interface ClipsInterface {
    data: ClipsDataInterface;
    message: string;
}

export interface ClipsDataInterface {
    count: number;
    list: ClipsItemInterface[];
}

export interface ClipsItemInterface {
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

export interface ClipsStateInitial {
    clip: ClipsItemInterface[];
    loading: boolean;
    count: number | undefined;
}
