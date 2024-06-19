import mongoose from "mongoose";

export interface BillingAddress extends Document {
  name: string;
  street: string;
  city: string;
  pincode: string;
  state: string;
  phoneNumber: string;
}

 export const billingAddressSchema = new mongoose.Schema<BillingAddress >({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  street: {
    type: String,
    required: [true, "Street is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  phoneNumber: {
    type: String,
  },
});