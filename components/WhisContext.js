import { createContext, useEffect, useState } from "react";

export const WhisContext = createContext({});

export function WhisContextProvider({ children }) {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [whisProduct, setWhisProducts] = useState(() => {
        const storedWhislist = ls?.getItem('whislist');
        return storedWhislist ? JSON.parse(storedWhislist) : [];
    });

    useEffect(() => {
        if (whisProduct?.length > 0 && ls) {
            ls.setItem('whislist', JSON.stringify(whisProduct));
        }
    }, [whisProduct, ls]);

    useEffect(() => {
        if (ls && ls.getItem('whislist')) {
            setWhisProducts(JSON.parse(ls.getItem('whislist')));
        }
    }, [ls]);

    function addWhis(productId) {
        setWhisProducts(prev => {
            // Ensure that prev is an array
            const currentWhislist = Array.isArray(prev) ? prev : [];
            return [...currentWhislist, productId];
        });
    }

    function removeWhis(productId) {
        setWhisProducts(prev => {
            const currentWhislist = Array.isArray(prev) ? prev : [];
            const newWhislist = currentWhislist.filter(id => id !== productId);
            ls?.setItem('whislist', JSON.stringify(newWhislist));
            return newWhislist;
        });
    }

    function clearWhis() {
        setWhisProducts([]);
    }

    return (
        <WhisContext.Provider value={{ whisProduct, setWhisProducts, addWhis, removeWhis, clearWhis }}>
            {children}
        </WhisContext.Provider>
    );
}

