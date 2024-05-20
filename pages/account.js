import React, { useContext, useEffect, useState } from 'react'
import Header from '@/components/Header'
import styled from 'styled-components'
import Button from '@/components/Button'
import Center from '@/components/Center'
import { CartContext } from '@/components/CartContext'
import axios from 'axios'
import Input from '@/components/Input'
import Table from '@/components/Table'
import { useSession, getSession } from "next-auth/react"
import AuthPage from './auth'
import { User } from '@/models/User'


const ColumnWrapper = styled.div`
   display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;


export default function AccountPage({ data }) {
    const user = data
    const [products, setProducts] = useState([]);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [city, setCity] = useState(user?.city || '');
    const whislistProduct = user?.whislist
    const [postCode, setPostalCode] = useState(user?.postCode || '');
    const [address, setStreetAddress] = useState(user?.address || '');

    useEffect(() => {
        if (whislistProduct?.length > 0) {
            axios.post('/api/product', { id: user.whislist }).then(response => {
                setProducts(response.data)
            })
        } else {
            setProducts([])
        }
    }, [whislistProduct])


    const saveUser = async (e) => {
        try {
            e.preventDefault();

            const dataUser = { name, email, city, postCode, address }
            await axios.post("/api/profile?email=" + user.email, dataUser)
        } catch (error) {
            console.log(error);
        }
    }

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


    // total price

    let total = 0;

    // for (const productId of whislistProduct) {
    //     const price = products.find(p => p._id === productId)?.price || 0
    //     total += price
    // }


    if (!data) {
        return <AuthPage />
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <Box>
                        <h2>Favorite</h2>
                        {whislistProduct.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={'http://localhost:3000/images/' + product.images[0]} alt="" />
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                ${whislistProduct.filter(id => id === product._id).length * product.price}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>${total}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        ) : (
                            <p>Ayo pilih menu kesukaan kamu!</p>
                        )}
                    </Box>

                    <Box>
                        <h2>Profile</h2>
                        <form onSubmit={saveUser}>
                            <Input type="text"
                                placeholder="Nama"
                                value={name}
                                name="name"
                                onChange={ev => setName(ev.target.value)} />
                            <Input type="text"
                                placeholder="Email"
                                value={email}
                                name="email"
                                onChange={ev => setEmail(ev.target.value)} />
                            <CityHolder>
                                <Input type="text"
                                    placeholder="Kota"
                                    value={city}
                                    name="city"
                                    onChange={ev => setCity(ev.target.value)} />
                                <Input type="text"
                                    placeholder="Kode Pos"
                                    value={postCode}
                                    name="postCode"
                                    onChange={ev => setPostalCode(ev.target.value)} />
                            </CityHolder>
                            <Input type="text"
                                placeholder="Alamat"
                                value={address}
                                name="streetAddress"
                                onChange={ev => setStreetAddress(ev.target.value)} />
                            {/* <Input type="text"
                                placeholder="Negara"
                                value={country}
                                name="country"
                                onChange={ev => setCountry(ev.target.value)} /> */}
                            <Button black block type="submit">
                                Update Profile
                            </Button>
                        </form>
                    </Box>
                </ColumnWrapper>
            </Center>
        </>
    );
}

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