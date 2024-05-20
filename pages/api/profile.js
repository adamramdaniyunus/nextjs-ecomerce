import mongooseConnect from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handle(req, res) {

    const { name, email, city, postCode, address } = req.body

    try {
        await mongooseConnect();
        const id = req.query.email;

        const user = await User.updateOne({ email: email }, { name, email, city, postCode, address })
        res.json("ok");
    } catch (error) {
        console.log(error);
    }
}