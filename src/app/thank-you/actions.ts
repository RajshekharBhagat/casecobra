"use server";

import { dbConnect } from "@/lib/dbConnect";
import OrderModel from "@/models/order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  try {
    await dbConnect();

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user.email) {
      throw new Error("You need to be logged in to view this page.");
    }

    const order = await OrderModel.findOne({
      _id: orderId,
      kindeId: user.id,
    }).populate('configuration').lean(); 

    if (!order) {
      throw new Error("This order does not exist");
    }

    if (order.isPaid) {
      return order;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in getPaymentStatus:", error);
    throw new Error("Internal Server Error");
  }

};
