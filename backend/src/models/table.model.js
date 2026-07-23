import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
    {
        tableNo: {
            type: Number,
            required: [true, "Table number is required"],
            unique: true,
            min: [1, "Table number must be greater than 0"],
        },

        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [1, "Capacity must be at least 1"],
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "OCCUPIED"],
            default: "AVAILABLE",
        },

        assignedWaiter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        currentOrder: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
    },

    {
        timestamps: true,
    }
)

const Table = mongoose.model("Table", tableSchema);

export default Table;