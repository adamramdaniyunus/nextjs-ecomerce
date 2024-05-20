import mongoose, { model, models, Schema } from "mongoose";

const WhisSchema = new Schema({
    userId: { type: String },
    productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
}, {
    timestamps: true,
});

export const WhistList = models?.WhistList || model('WhisList', WhisSchema);