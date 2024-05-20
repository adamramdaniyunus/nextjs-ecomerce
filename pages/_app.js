import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import AOS from 'aos'
import { useEffect } from "react";
import 'aos/dist/aos.css';
import { SessionProvider } from "next-auth/react";
import { WhisContextProvider } from "@/components/WhisContext";

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    AOS.init();
  });
  return (
    <SessionProvider session={session}>
      <GlobalStyles />
      <WhisContextProvider>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </WhisContextProvider>
    </SessionProvider>
  );
}