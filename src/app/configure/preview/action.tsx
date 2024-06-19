'use server';
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { dbConnect } from "@/lib/dbConnect";
import { stripe } from "@/lib/stripe";
import ConfigurationModel from "@/models/configuration";
import OrderModel, { Order } from "@/models/order";
import { getKindeServerSession ,} from "@kinde-oss/kinde-auth-nextjs/server";

export const createCheckOutSession = async({configId}:{configId: string}) => {
    await dbConnect();
    const configuration = await ConfigurationModel.findById(configId);
    if(!configuration) {
        throw new Error('No such configuration found');
    }

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user) {
        throw new Error('Your need to be logged in');
    }
    
    const {caseFinish, caseMaterial} = configuration;
    let price = BASE_PRICE;
    if(caseFinish === 'textured') price += PRODUCT_PRICES.finish.textured
    if(caseMaterial === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate

    let order: Order | undefined = undefined;
    const existingOrder = await OrderModel.findOne({
        $or: [{kindeId: user.id}, {configurationId: configuration._id}]
    });
    if(existingOrder) {
        order = existingOrder
    } else {
        order = new OrderModel({
            amount: price,
            kindeId: user.id,
            configurationId: configuration._id,
        });
        await order.save();
    }

    if(!order) {
        throw new Error('Something went wrong while creating your order. Please try again after some time')
    }

    const product = await stripe.products.create({
        name: 'Custom Iphone Case',
        images: [configuration.imageUrl],
        default_price_data: {
            currency: "INR",
            unit_amount: price * 100,
        },
    });

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration._id}`,
        payment_method_types: ['card'],
        mode: 'payment',
        shipping_address_collection: {
            allowed_countries: ['IN','NE'],
        },
        metadata: {
            userId: user.id,
            orderId: order._id.toString() as string,
        },
        line_items: [{price: product.default_price as string, quantity: 1,}]
    })
    return {url: stripeSession.url};
}