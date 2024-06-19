import mongoose, { Document } from "mongoose";
import { OrderStatus } from "./configuration";
import { ShippingAddress, shippingAddressSchema } from "./shippingAddress";

export interface Order extends Document {
  configurationId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  kindeId: string;
  amount: number;
  isPaid: boolean;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
}

const orderSchema = new mongoose.Schema<Order>({
  configurationId: {
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
  }
});

const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", orderSchema);
export default OrderModel;
