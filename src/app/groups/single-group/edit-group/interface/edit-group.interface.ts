export interface EditGroupInterface {
    avatar: string;
    creator_id: number;
    custom_name: string;
    cover: string;
    description: string;
    group_members: GroupMember [];
    id: number;
    name: string;
    privacy: number;
}


export interface GroupMember {
    avatar: string;
    first_name: string;
    groups_members: GroupMemberInfo;
    id: number;
    last_name: string;
    username: string;
}

export interface GroupMemberInfo {
    accepted: number;
    confirmed: number;
    created_at: string;
    group_id: number;
    is_admin: number;
    is_moderator: number;
    member_id: number;
    updated_at: string;
}
