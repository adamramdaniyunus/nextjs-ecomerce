import ProductBox from "./ProductBox";
import styled from "styled-components";

const StyledProductGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-bottom:40px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

export default function ProductGrid({ products }) {
    return (
        <StyledProductGrid>
            {products?.length > 0 && products.map((product, index) => (
                <ProductBox key={product._id} {...product} i={index} data-aos="fade-up" />
            ))}
        </StyledProductGrid>
    )
}