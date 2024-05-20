import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
    name: String,
    email: String,
    city: String,
    postCode: String,
    address: String,
    whislist: [],
}, {
    timestamps: true,
});

export const User = models?.User || model('User', UserSchema);