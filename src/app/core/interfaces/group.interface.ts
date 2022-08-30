export interface GroupInterface {
    data: GroupItemInterface[];
    message: string;
}

export interface GroupItemInterface {
    avatar: string;
    creator_id: number;
    group_members: GroupMembersInterface[];
    id: number;
    name: string;
    privacy: number;
}

export interface GroupMembersInterface {
    avatar: string;
    first_name: string;
    groups_members: GroupMemberInterface;
    id: number;
    last_name: string;
    username: string;
}

export interface GroupMemberInterface {
    accepted: number;
    confirmed: number;
    created_at: string;
    group_id: number;
    is_admin: number;
    is_moderator: number;
    member_id: number;
    updated_at: string;
}

export interface GroupInitialStateInterface {
    groups: GroupItemInterface[] | any;
    loading: boolean;
}
