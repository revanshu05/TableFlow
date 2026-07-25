import mongoose, { Schema } from "mongoose";

const menuItemSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Menu item name is required"],
			unique: true,
			trim: true,
		},

		description: {
			type: String,
			trim: true,
			default: "",
		},

		category: {
			type: String,
			required: [true, "Category is required"],
			enum: [
				"STARTER",
				"MAIN_COURSE",
				"BEVERAGE",
				"SOUP",
				"DESSERT",
				"PIZZA",
				"DRINK",
				"SALAD",
			],
		},

		price: {
			type: Number,
			required: [true, "Price is required"],
			min: [0, "Price cannot be negative"],
		},

		isAvailable: {
			type: Boolean,
			default: true,
		},
  	},

	{
		timestamps: true,
	}
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;