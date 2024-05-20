import React, { useContext, useEffect, useState } from 'react'
import Header from '@/components/Header'
import styled from 'styled-components'
import Button from '@/components/Button'
import Center from '@/components/Center'
import { CartContext } from '@/components/CartContext'
import axios from 'axios'
import Input from '@/components/Input'
import Table from '@/components/Table'
import { getSession } from 'next-auth/react'
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

export default function CartPage({ data }) {
    const user = data;
    const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [city, setCity] = useState(user?.city || '');
    const [postCode, setPostalCode] = useState(user?.postCode || '');
    const [address, setStreetAddress] = useState(user?.address || '');
    const [isSuccess, setSuccess] = useState(false);
    const [snapLoaded, setSnapLoaded] = useState(false);

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/product', { id: cartProducts }).then(response => {
                setProducts(response.data);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            return;
        }

        if (window?.location.href.includes('success')) {
            setSuccess(true);
            clearCart();
        }
    }, []);

    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY;
        const script = document.createElement('script');
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        script.onload = () => {
            setSnapLoaded(true);
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    function addMoreThisProduct(id) {
        addProduct(id);
    }

    function decreaseThisProduct(id) {
        removeProduct(id);
    }

    let total = 0;

    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    if (isSuccess) {
        return (
            <>
                <Header />
                <Center>
                    <ColumnWrapper>
                        <Box>
                            <h1>Thanks for your order!</h1>
                            <p>We will email you when your order will be sent.</p>
                        </Box>
                    </ColumnWrapper>
                </Center>
            </>
        );
    }

    const checkOut = async () => {
        try {
            const productsCheckOut = products.map(product => ({
                id: product._id,
                title: product.title,
                price: product.price,
                quantity: cartProducts.filter(id => id === product._id).length,
            }));

            const data = {
                name: name,
                email: email,
                products: productsCheckOut
            };

            const response = await axios.post('/api/tokenizer', data);

            if (snapLoaded && window.snap) {
                window.snap.pay(response.data.token, {
                    onSuccess: function (result) {
                        console.log('Payment success', result);
                    },
                    onPending: function (result) {
                        console.log('Payment pending', result);
                    },
                    onError: function (result) {
                        console.error('Payment error', result);
                    },
                    onClose: function () {
                        console.log('Payment popup closed');
                    }
                });
            } else {
                console.error('Snap script not loaded yet or snap object is not available');
            }
        } catch (error) {
            console.log(error);
            alert('Failed to create transaction: ' + error.message);
        }
    };

    return (
        <>
            <Header />
            <Center>
                <ColumnWrapper>
                    <Box>
                        <h2>Cart</h2>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
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
                                                <Button onClick={() => decreaseThisProduct(product._id)}>-</Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <Button onClick={() => addMoreThisProduct(product._id)}>+</Button>
                                            </td>
                                            <td>
                                                ${cartProducts.filter(id => id === product._id).length * product.price}
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
                        )}
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                            <h2>Order Detail</h2>
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
                                    name="postalCode"
                                    onChange={ev => setPostalCode(ev.target.value)} />
                            </CityHolder>
                            <Input type="text"
                                placeholder="Alamat"
                                value={address}
                                name="streetAddress"
                                onChange={ev => setStreetAddress(ev.target.value)} />
                            <Button black block onClick={checkOut}>Bayar Sekarang</Button>
                        </Box>
                    )}
                </ColumnWrapper>
            </Center>
        </>
    );
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    if (!session) {
        return {
            props: {
                data: null
            }
        };
    }
    const { user } = session;
    const userData = await User.findOne({ email: user.email });
    return {
        props: {
            data: JSON.parse(JSON.stringify(userData))
        }
    };
}
