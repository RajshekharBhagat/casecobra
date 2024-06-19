'use server';

import UserModel from "@/models/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async() => {

    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if(!user?.id || !user.email) {
        throw new Error('Invalid User data');
    }

    const existingUser = await UserModel.findOne({kindId: user.id});
    if(!existingUser) {
        const newUser = new UserModel({
            kindId: user.id,
            email: user.email,
        })
        await newUser.save();
    } 
    return {
        success: true,
    }

}