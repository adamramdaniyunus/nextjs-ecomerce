import React, { useContext } from 'react'
import Center from './Center'
import styled from 'styled-components'
import { CartContext } from './CartContext'
import CartIcon from './icons/CartIcon'
import Button from './Button'
import ButtonLink from './ButtonLink'

const BG = styled.div`
    background-color: #222;
    color:#fff;
    padding: 50px 0;
`

const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size:1.5rem;
  @media screen and (min-width: 768px) {
    font-size:3rem;
  }
`;

const Desc = styled.p`
  color:#aaa;
  font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img{
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img{
      max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap:10px;
  margin-top:25px;
`;



const Featured = ({ product }) => {

  const { addProduct } = useContext(CartContext)


  // add product to cart
  const addFeatureToCart = () => {
    addProduct(product?._id)
  }

  return (
    <BG>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>
                {product?.title}
              </Title>
              <Desc>
                {product?.desc}
              </Desc>
              <ButtonsWrapper>
                <ButtonLink href={'/product/' + product?._id} outline={1} white={1}>Read more</ButtonLink>
                <Button white="true" onClick={addFeatureToCart}>
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>

          <Column>
            <img src={"http://localhost:3000/images/" + product.images[0]} alt="" />
          </Column>
        </ColumnsWrapper>
      </Center>
    </BG>
  )
}

export default Featured
