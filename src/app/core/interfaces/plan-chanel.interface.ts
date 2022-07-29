export interface PlanChanelResponseInterface {
    data: PlanChanelData [];
    message: string;
}

export interface PlanChanelData {
    createdAt: string;
    created_at: string;
    custom_fields: PlanChanelCustomFieldsInterface;
    description: string;
    id: number;
    name: string;
    updatedAt: string;
    updated_at: string;
}

export interface PlanChanelCustomFieldsInterface {
    badgeColor: string;
}
