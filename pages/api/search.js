import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import ProductModel from "@/models/Product";

export default async function handle(req, res) {
    try {
        await mongooseConnect();

        const search = req.query.search || "";
        let category = req.query.category || "";

        let categoryQuery = {};
        if (category) {
            const categoryData = await Category.findOne({ name: category });

            categoryQuery = { category: { $in: [categoryData._id] } };
        }
        let searchQuery = {};

        if (search) {
            searchQuery = { title: { $regex: new RegExp(search.split(' ').join('|'), "i") } };
        }

        const products = await ProductModel.find({
            ...searchQuery,
            ...categoryQuery
        });


        return res.json(products)

    } catch (error) {
        console.log(error);
        return res.status(500)
    }
}