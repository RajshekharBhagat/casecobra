"use server";

import OrderModel, { Order } from "@/models/order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("you need to be logged in to view this page.");
  }

  const order = await OrderModel.findOne({
    $and: [{ _id: orderId }, { kindeId: user.id }],
  })

  if (!order) {
    throw new Error("This order does not exist");
  }

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }

};
