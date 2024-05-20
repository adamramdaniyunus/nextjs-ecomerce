import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: String,
    price: {
        type: Number,
        required: true
    },
    images: [],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object },
}, {
    timestamps: true
})

// const ProductModel = model('Products', ProductSchema)
const ProductModel = models.Products || model("Products", ProductSchema)

export default ProductModel