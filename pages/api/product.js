import mongooseConnect from "@/lib/mongoose";
import ProductModel from "@/models/Product";

export default async function handle(req, res) {
    try {
        await mongooseConnect();
        const id = req.body.id;

        const product = await ProductModel.find({ _id: id })
        res.json(product);
    } catch (error) {
        console.log(error);
    }
}