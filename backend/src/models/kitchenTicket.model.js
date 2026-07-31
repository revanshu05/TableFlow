import { Schema, model } from "mongoose";

const kitchenTicketItemSchema = new Schema(
    {
        menuItem: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const kitchenTicketSchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        table: {
            type: Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },

        waiter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        ticketNumber: {
            type: Number,
            required: true,
            unique: true,
        },

        items: {
            type: [kitchenTicketItemSchema],
            required: true,
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PREPARING",
                "READY",
                "SERVED",
            ],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

kitchenTicketSchema.index({
    order: 1,
    createdAt: 1,
});

kitchenTicketSchema.index({
    status: 1,
    createdAt: 1,
});

kitchenTicketSchema.index({
    waiter: 1,
});

const KitchenTicket = model("KitchenTicket", kitchenTicketSchema);
export default KitchenTicket;