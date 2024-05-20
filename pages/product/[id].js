import Button from "@/components/Button";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImage";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import Center from "@/components/Center";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/icons/CartIcon";
import mongooseConnect from "@/lib/mongoose";
import ProductModel from "@/models/Product";
import styled from "styled-components";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;


export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext)
    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>
                            {product.title}
                        </Title>
                        <p>{product.desc}</p>
                        <PriceRow>
                            <div>
                                <Price>${product.price}</Price>
                            </div>
                            <div>
                                <Button primary onclick={() => addProduct(product._id)}>
                                    <CartIcon />Add to cart
                                </Button>
                            </div>
                        </PriceRow>
                    </div>
                </ColWrapper>
            </Center>
        </>
    );
}

export async function getServerSideProps(ctx) {
    await mongooseConnect()
    const { id } = ctx.query;
    const product = await ProductModel.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }
}
