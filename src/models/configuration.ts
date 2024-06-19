import mongoose, { Document, Schema } from "mongoose";

export enum OrderStatus {
  FulFilled = "fulfilled",
  Shipped = "shipped",
  AwaitingShipment = "awaitingShipment",
}

export enum PhoneModel {
  IphoneX = "iphoneX",
  Iphone11 = "iphone11",
  Iphone12 = "iphone12",
  Iphone13 = "iphone13",
  Iphone14 = "iphone14",
  Iphone15 = "iphone15",
}

export enum CaseMaterial {
  Silicone = "silicone",
  Polycarbonate = "polycarbonate",
}

export enum CaseFinish {
  Smooth = "smooth",
  Textured = "textured",
}

export enum CaseColor {
  Black = "black",
  Blue = "blue",
  Rose = "rose",
}

export interface Configuration extends Document {
  height: number;
  width: number;
  imageUrl: string;
  configuredImageUrl: string;
  orderStatus: OrderStatus;
  phoneModel: PhoneModel;
  caseColor: CaseColor;
  caseMaterial: CaseMaterial;
  caseFinish: CaseFinish;
}

const configurationSchema = new Schema<Configuration>({
  height: {
    type: Number,
    required: [true, "Height of the image is required"],
  },
  width: {
    type: Number,
    required: [true, "Width of the image is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "ImageUrl is required"],
  },
  configuredImageUrl: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
  },
  phoneModel: {
    type: String,
    enum: Object.values(PhoneModel),
  },
  caseColor: {
    type: String,
    enum: Object.values(CaseColor),
  },
  caseMaterial: {
    type: String,
    enum: Object.values(CaseMaterial),
  },
  caseFinish: {
    type: String,
    enum: Object.values(CaseFinish),
  },
});

const ConfigurationModel =
  (mongoose.models.Configuration as mongoose.Model<Configuration>) ||
  mongoose.model<Configuration>("Configuration", configurationSchema);
export default ConfigurationModel;
