import {User} from '@shared/models/user';

export interface Post {
    id?: number;
    author_id: number;
    title?: string;
    description: string;
    cover_img: string;
    votes: number;
    views: number;
    privacy: number;
    liked?: number;
    user_posts?: any;
    post_author: User;
    post_group: any;
    created_at: Date;
    updated_at: Date;
}
