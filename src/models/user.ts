import mongoose, { Schema } from "mongoose";

interface User extends Document {
    kindId: string
    email: string,
    order: mongoose.Types.ObjectId[],
}

const userSchema = new Schema<User>({
    kindId: {
        type: String,
        required: [true,'KindId is required'],
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        match: [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,'please use a valid email address'],
    },
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
}, {timestamps: true});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',userSchema);
export default UserModel;