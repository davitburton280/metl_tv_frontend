export interface SubscriptionResponseInterface {
    avatar: string;
    cover: string;
    created_at: string;
    description: string;
    id: number;
    name: string;
    subscribers: SubscribersItem[];
    subscribers_count: number;
    updated_at: string;
    user_id: number;
}


export interface SubscribersItem {
    avatar: string;
    channel_subscribers: SubscriptionChannelInterface;
    first_name: string;
    id: number;
    last_name: string;
    username: string;
}

export interface SubscriptionChannelInterface {
    subscriber_id: number;
    channel_id: number;
    position_id: number;
}
