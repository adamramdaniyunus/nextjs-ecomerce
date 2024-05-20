import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import mongooseConnect from "@/lib/mongoose";
import ProductGrid from "@/components/ProductGrid";
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { Category } from "@/models/Category";
import { MoonLoader } from "react-spinners";

const SearchBox = styled.div`
    padding: 20px;
`

const LoadBox = styled.div`
    display:flex;
    justify-content:center;
    height: 180px;
    align-items:center;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing:border-box;
`;

const SelectInput = styled.select`
      background-color: white;
      padding: 8px; /* Atur sesuai kebutuhan */
      border: 1px solid #ccc; /* Atur sesuai kebutuhan */
      border-radius: 4px; /* Atur sesuai kebutuhan */
      font-size: 16px; /* Atur sesuai kebutuhan */
`



export default function CategoryPage({ categories }) {

    const [products, setProduct] = useState([])

    const [search, setSearch] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [category, setCategory] = useState('');

    const getResult = async () => {
        setLoading(true)
        const response = await axios.get(`/api/search?search=${search}&category=${category}`);
        setLoading(false)
        setProduct(response.data)

        // AOS.refresh()
    }

    useEffect(() => {
        getResult()
        fecthResult()
    }, [category])

    // useEffect(() => {
    //     getResult()
    // }, [])

    const handleSearch = async (e) => {
        const inputValue = e.target.value;

        setSearch(inputValue);

        // jalankan jika 3 huruf dimasukan

        if (inputValue?.length > 2) {
            // setCategory('')
            await getResult()
        }
    }

    // ini untuk mendapatkan data berdasarkan category saja tanpa search value
    const fecthResult = async () => {
        if (category) {
            await getResult()
        }
    }

    return (
        <>
            <Header />
            <Center>
                <SearchBox>
                    <SearchInput placeholder="Search" value={search} onChange={handleSearch} />
                    <p>Cari berdasarkan kategori</p>
                    <SelectInput onChange={e => setCategory(e.target.value === 'All' ? '' : e.target.value)}>
                        <option>All</option>
                        {categories.map((data) => (
                            <option key={data._id} value={data.name}>{data.name}</option>
                        ))}
                    </SelectInput>

                </SearchBox>
            </Center>
            <Center>
                <Title>Products</Title>
                {isLoading ? (
                    <Center>
                        <LoadBox>
                            <MoonLoader size={50} color="#222" />
                        </LoadBox>
                    </Center>
                ) : (
                    products.length === 0 ? (
                        <Center>Product akan muncul disini</Center>
                    ) : (
                        <ProductGrid products={products} data-aos="fade-up" />
                    )
                )}
            </Center>
        </>
    )
}

export async function getServerSideProps() {
    await mongooseConnect()
    const categories = await Category.find()
    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories)),
        }
    }
}