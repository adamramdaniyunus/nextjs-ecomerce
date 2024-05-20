import Featured from '@/components/Featured'
import Header from '@/components/Header'
import NewProducts from '@/components/NewProducts'
import mongooseConnect from '@/lib/mongoose'
import ProductModel from '@/models/Product'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import styled from 'styled-components'

const inter = Inter({ subsets: ['latin'] })


export default function Home({ featuredProduct, newProducts }) {
  return (
    <>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </>
  )
}


export async function getServerSideProps() {
  const featuredProductId = "65926f67cda29d1d4d1433d8";
  await mongooseConnect()
  const featuredProduct = await ProductModel.findById(featuredProductId);
  const newProducts = await ProductModel.find({}, null, { sort: { '_id': -1 }, limit: 10 })
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    }
  }
}