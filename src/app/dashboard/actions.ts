import { dbConnect } from "@/lib/dbConnect"
import OrderModel, { Order } from "@/models/order";

export const getRecentOrders = async() => {
    await dbConnect();
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const order = await OrderModel.find({
            isPaid: true,
            createdAt: {    
                $gte: sevenDaysAgo
            }
        }).populate('configuration').lean();
        if(!order) {
            throw new Error('Error fetching orders')
        }
        return order as Order[]
    } catch (error) {
        console.log('Something went wrong while fetching the errors: ', error);
        throw new Error('Internal Server Error');
    }
}