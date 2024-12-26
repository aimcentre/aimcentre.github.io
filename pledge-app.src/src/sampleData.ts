import type { PledgeFormDefinition } from "./models";

export default {
    title: "Kathina Donations",
    description: "Please submit your pledge for the Kathina donations.",
    items: [
        {
            title: "Temple Operational Expenses",
            description: "These are the projected expenses related to continuied operation of the temple over the coming year."
        },
        {
            title: "Electricity bill",
            description: "One unit is one-month sponsorship.",
            unitPrice: 200,
            unitsRequired: 12,
            unitsReceived: 2,
            unitLabelSingular: "month",
            unitLabelPlural: "months"
        },
        {
            title: "Average heating bill",
            unitPrice: 80,
            unitsRequired: 12,
            unitsReceived: 0,
            unitLabelSingular: "month",
            unitLabelPlural: "months"
        },
        {
            title: "100 Watt equivalent, 6-pack LED lamps",
            unitsRequired: 3,
            unitsReceived: 2,
            unitLabelSingular: "pack",
            unitLabelPlural: "packs"
        }
    ]

} as PledgeFormDefinition;
