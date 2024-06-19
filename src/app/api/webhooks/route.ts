import { stripe } from "@/lib/stripe";
import OrderModel from "@/models/order";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    if (!signature) {
      return new NextResponse("Invalid Signature", { status: 400 });
    }
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRETE!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details?.address;
      const shippingAddress = session.shipping_details?.address;
      console.log(shippingAddress)

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          shippingAddress: {
            name: session.customer_details?.name,
            street: shippingAddress?.line1,
            city: shippingAddress?.city,
            pincode: shippingAddress?.postal_code,
            state: shippingAddress?.state,
          },
          billingAddress: {
            name: session.customer_details?.name,
            street: billingAddress?.line1,
            city: billingAddress?.city,
            pincode: billingAddress?.postal_code,
            state: billingAddress?.state,
          },
          isPaid: true,
        },
        { new: true }
      );
      if(!updatedOrder) {
        throw new Error('Order not found');
      }
    }

    return NextResponse.json({
      result: event,
      ok: true,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
