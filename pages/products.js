import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import mongooseConnect from "@/lib/mongoose";
import ProductModel from "@/models/Product";
import ProductGrid from "@/components/ProductGrid";
import Title from "@/components/Title";

export default function ProductsPage({ products }) {
    return (
        <>
            <Header />
            <Center>
                <Title>All Products</Title>
                <ProductGrid products={products} />
            </Center>
        </>
    )
}

export async function getServerSideProps() {
    await mongooseConnect()
    const products = await ProductModel.find({}, null, { sort: { '_id': -1 } })
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        }
    }
}