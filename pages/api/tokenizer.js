import Midtrans from 'midtrans-client'
import { NextResponse } from 'next/server';

export default async function POST(req, res) {
    const { name, email, products } = req.body;

    let snap = new Midtrans.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
    });

    let itemDetails = products.map(product => ({
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        name: product.title
    }))

    let grossAmount = itemDetails.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let parameter = {
        customer_details: {
            first_name: name,
            email: email,
        },

        item_details: itemDetails,
        transaction_details: {
            order_id: Math.floor(Math.random() * 100),
            gross_amount: grossAmount
        }
    }

    const token = await snap.createTransactionToken(parameter);

    return res.json({ token })
}