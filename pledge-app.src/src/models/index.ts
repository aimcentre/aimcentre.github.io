export interface ListEntry {
    title: string;
    description?: string;
    unitsRequired?: number;
    unitsReceived?: number;
    unitPrice?: number;
    unitLabelSingular?: string;
    unitLabelPlural?: string;
}


export interface PledgeFormDefinition {
    title: string;
    description: string;
    items: ListEntry[];
}
