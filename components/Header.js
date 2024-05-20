import React, { useContext, useState } from 'react'
import styled from "styled-components";
import Center from './Center';
import Link from 'next/link';
import BarsIcon from './icons/Bars';
import { CartContext } from './CartContext';
import { IoIosSearch } from "react-icons/io";
import { TiShoppingCart } from "react-icons/ti";
import { FiHome } from "react-icons/fi";
import { CiCoffeeCup } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";






const StylesHeader = styled.header`
 background-color: #222;
`

const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  z-index:99999;
`;

const NavLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items:center;
  gap:4px;
  color:#ffffff;
  text-decoration:none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding:0;
  }
`;


const StyledNav = styled.nav`
  ${props => props.mobilenavactive ? `
    display: flex;
    flex-direction:column;
  ` : `
    display: none;
  `}
  z-index: 999;
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  z-index:9999;
  border:0;
  color: white;
  cursor: pointer;
  position: relative;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;




const Header = () => {
  const [mobilenavactive, setMobileNavActive] = useState(false);
  const { cartProducts } = useContext(CartContext)

  const iconSize = 24;
  return (
    <StylesHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>NextEcommerce</Logo>
          <StyledNav mobilenavactive={mobilenavactive}>
            <NavLink href={'/'}><FiHome style={{ fontSize: iconSize }} />Home</NavLink>
            <NavLink href={'/products'}><CiCoffeeCup style={{ fontSize: iconSize }} />Coffee</NavLink>
            {/* <NavLink href={'/account'}><IoPersonCircleOutline style={{ fontSize: iconSize }} />Account</NavLink> */}
            <NavLink href={'/cart'} id='cartIcon'><TiShoppingCart style={{ fontSize: iconSize }} />Cart ({cartProducts.length})</NavLink>
            {/* <NavLink href={'/search'}>
              <IoIosSearch style={{ fontSize: iconSize }} /> Search
            </NavLink> */}
          </StyledNav>
          <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon />
          </NavButton>

        </Wrapper>
      </Center>
    </StylesHeader>
  )
}

export default Header
