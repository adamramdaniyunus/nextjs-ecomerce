import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Center from '@/components/Center'
import { CartContext } from '@/components/CartContext'
import axios from 'axios'
import { signIn, useSession } from "next-auth/react"
import { FaGoogle } from "react-icons/fa";
import Header from '@/components/Header'


const ColumnWrapper = styled.div`
display: flex;
justify-content:center;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  padding: 30px;
`;


const ButtonGoogle = styled.button`
  background:#fff;
  padding: 10px 20px;
  display:flex;
  align-items:center;
  gap: 4px;
  font-size: 1.2rem;
  cursor:pointer;
  border-radius: 2rem;
`


export default function AuthPage() {

    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);

    const [isSuccess, setSuccess] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/product', { id: cartProducts }).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([])
        }
    }, [cartProducts])

    // clear cart

    useEffect(() => {
        if (typeof window !== 'undefined') {
            return;
        };

        if (window?.location.href.includes('success')) {
            setSuccess(true);
            clearCart()
        }
    }, [])

    // function to add more product value

    function addMoreThisProduct(id) {
        addProduct(id)
    }

    // function to decrease the product 
    function decreaseThisProduct(id) {
        removeProduct(id)
    }


    // total price

    let total = 0;

    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0
        total += price
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <Box>
                        <h2>Login</h2>
                        <div className="bg-bgGray w-screen h-screen flex items-center">
                            <div className="text-center w-full">
                                <ButtonGoogle onClick={() => signIn('google')}><FaGoogle />Login With Google</ButtonGoogle>
                            </div>
                        </div>
                    </Box>
                </ColumnWrapper>
            </Center>
        </>
    );
}

