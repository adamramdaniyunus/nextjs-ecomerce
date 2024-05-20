import mongooseConnect from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handle(req, res) {

    const { userId, productId } = req.body

    try {
        await mongooseConnect();

        const user = await User.findOne({ email: userId });

        if (!user) return res.status(404);

        if (user.whislist.includes(productId)) {
            await User.updateOne({ email: userId }, {
                $pull: {
                    whislist: productId
                }
            })

            return res.json("remove whislist");
        } else {
            await User.updateOne({ email: userId }, {
                $push: {
                    whislist: productId
                }
            })

            return res.json("add whislist");
        }

    } catch (error) {
        console.log(error);
    }
}