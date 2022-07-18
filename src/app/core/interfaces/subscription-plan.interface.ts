export interface SubscriptionPlanResponseInterface {
    data: SubscriptionPlanData[];
    message: string;
}

export interface SubscriptionPlanData {
    cost: number;
    createdAt: string;
    created_at: string;
    description: string;
    id: number;
    name: string;
    permissions: number[];
    updatedAt: string;
    updated_at: string;
}
