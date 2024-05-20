import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { CartContext } from './CartContext';
import Button from './Button';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { User } from '@/models/User';
import { WhisContext } from './WhisContext';




const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 100px;
  }`;


const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

const Wrapper = styled.div`
  position: relative;
`

const PlusWhis = styled.button`
  position: absolute;
  top: 5px;
  z-index: 100;
  right: 5px;
  border:none;
  background:none;
  cursor:pointer;
`

const Icon = styled.svg`
  width: 27px
`

const ButtonLink = styled(Link)`
  border:0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  color: #fff;
  background: #e1805e;
`

const ProductBox = ({ _id, title, desc, price, images, i, data }) => {
  const { addProduct } = useContext(CartContext);
  const url = 'product/' + _id

  const { data: session } = useSession()

  const { addWhis, removeWhis, whisProduct } = useContext(WhisContext)
  const [fav, setFav] = useState(whisProduct?.includes(_id));

  const userId = session?.user?.email;
  const productId = _id

  const delay = (i + 1) * 200

  const handleWhis = async () => {
    try {
      if (!whisProduct.includes(_id)) {
        addWhis(_id)
      } else {
        removeWhis(_id)
      }
      setFav(prev => !prev)
      // ini untuk dikirim ke database
      const dataSend = { userId, productId }
      await axios.post('/api/whis', dataSend)



    } catch (error) {
      console.log(error);
    }
  }


  const handleAddToCart = () => {
    // Panggil fungsi addProduct
    addProduct(_id);

    // Ambil elemen gambar produk
    const productImage = document.querySelector(`#productImage${_id}`);

    // Ambil elemen ikon keranjang
    const cartIcon = document.querySelector('#cartIcon');

    // Clone gambar produk untuk membuat efek animasi
    const productImageClone = productImage.cloneNode(true);
    productImageClone.style.position = 'absolute';
    productImageClone.style.zIndex = 9999;
    productImageClone.style.transition = 'all 0.5s ease-out';

    // Mendapatkan posisi absolut gambar produk
    const rect = productImage.getBoundingClientRect();

    // Atur posisi absolut gambar produk ke posisi absolutnya
    productImageClone.style.top = `${rect.top}px`;
    productImageClone.style.left = `${rect.left}px`;
    productImageClone.style.width = `${rect.width}px`;

    // Tambahkan gambar produk yang di-clone ke body
    document.body.appendChild(productImageClone);

    // Menganimasikan gambar produk menuju ikon keranjang
    const cartRect = cartIcon.getBoundingClientRect();
    productImageClone.style.top = `${cartRect.top}px`;
    productImageClone.style.left = `${cartRect.left}px`;
    productImageClone.style.width = '50px';

    // Hilangkan gambar produk yang di-clone setelah animasi selesai
    productImageClone.addEventListener('transitionend', () => {
      productImageClone.remove();
    });
  };


  return (
    <Wrapper data-aos="fade-up" data-aos-duration={`${delay}`}>

      {session && (
        <PlusWhis onClick={handleWhis}>
          <Icon xmlns="http://www.w3.org/2000/svg" fill={fav ? "red" : "white"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </Icon>
        </PlusWhis>
      )}

      <WhiteBox href={url}>
        <div>
          <img id={`productImage${_id}`} src={`http://localhost:3000/images/${images?.[0]}`} alt="" />
        </div>
      </WhiteBox>

      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            ${price}
          </Price>
          <Button block onClick={handleAddToCart} primary outline>
            Add to cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </Wrapper>
  )
}

export default ProductBox


export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      props: {
        data: null
      }
    }
  }
  const { user } = session
  const userData = await User.findOne({ email: user.email })
  return {
    props: {
      data: JSON.parse(JSON.stringify(userData))
    }
  }
}