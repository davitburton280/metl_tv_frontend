import {StocksOrderTypeInterface} from '@core/interfaces/stocks-order-type.interface';

export interface CurrentUserResponseInterface {
    data: CurrentUserData;
    message: string;
}


export interface CurrentUserData {
    avatar: string;
    birthday: string;
    channel: ChanelInterface;
    cover: string;
    email: string;
    first_name: string;
    gender: string;
    id: number;
    last_name: string;
    password: string;
    phone: string;
    role_id: number;
    status_id: number;
    stocks_order_type: StocksOrderTypeInterface;
    stocks_order_type_id: number;
    subscription_id: number;
    username: string;
    users_cards: any;
    verification_code: any;
}


export interface ChanelInterface {
    avatar: string;
    cover: string;
    created_at: string;
    description: string;
    id: number;
    name: string;
    subscribers_count: number;
    updated_at: string;
    user_id: number;
}
