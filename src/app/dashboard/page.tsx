import OrderModel, { Order } from "@/models/order";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getRecentOrders } from "./actions";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/user";

const Page = async() => {

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    if(!user || user.email !== ADMIN_EMAIL) {
        return notFound();
    }
    await dbConnect();
    const userId = await UserModel.findOne({kindId: user.id})
    const orders = await OrderModel.find({
        isPaid: true
    }).populate('configuration').populate('user');

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {orders?.map((order) => (
                <div key={order._id.toString()}>
                    {order._id.toString()}
                    <p>{order.user._id.toString()}</p>
                    <p>{order.configuration.phoneModel}</p>
                    </div>
                
            ))}
        </div>
    )
}

export default Page;