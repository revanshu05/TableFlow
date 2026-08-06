import mongoose, { Schema, model } from "mongoose";

const customerSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        members: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const orderItemSchema = new Schema(
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

const orderSchema = new Schema(
    {
        orderNumber: {
            type: Number,
            required: true,
            unique: true,
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

        customer: {
            type: customerSchema,
            required: true,
        },

        items: {
            type: [orderItemSchema],
            default: [],
        },

        subtotal: {
            type: Number,
            default: 0,
            min: 0,
        },

        tax: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        grandTotal: {
            type: Number,
            default: 0,
            min: 0,
        },

        kotCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: [ "OPEN", "PAYMENT_PENDING", "COMPLETED" ],
            default: "OPEN",
        },

        paymentStatus: {
            type: String,
            enum: [ "UNPAID", "PAID" ],
            default: "UNPAID",
        },

        paymentMethod: {
            type: String,
            enum: [ "CASH", "CARD", "UPI" ],
            default: null,
        },

        tip: {
            type: Number,
            default: 0,
            min: 0,
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        requestedBillAt: {
            type: Date,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        closedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

orderSchema.index({
    table: 1,
    status: 1,
});

orderSchema.index({
    status: 1,
});

const Order = model("Order", orderSchema);
export default Order;