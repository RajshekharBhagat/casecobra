import mongoose, { Document } from "mongoose";
import { Configuration, OrderStatus } from "./configuration";
import { ShippingAddress, shippingAddressSchema } from "./shippingAddress";
import { BillingAddress, billingAddressSchema } from "./billingAddress";

export interface Order extends Document {
  _id: mongoose.Types.ObjectId;
  configuration: Configuration;
  user: mongoose.Types.ObjectId;
  kindeId: string;
  amount: number;
  isPaid: boolean;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  createdAt: Date,
  updatedAt: Date,
}

const orderSchema = new mongoose.Schema<Order>({
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Configuration",
    required: true,
  },
  kindeId: {
    type: String,
    required: [true, "KindId is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.AwaitingShipment,
  },
  shippingAddress: {
    type: shippingAddressSchema,
  },
  billingAddress: {
    type: billingAddressSchema,
  }
},{timestamps: true});

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", orderSchema);
export default OrderModel;
