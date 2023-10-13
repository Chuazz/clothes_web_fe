'use client';

import { useDispatch } from '@assets/redux';
import cartSlice from '@assets/redux/slices/cart/slice';
import { PageProps } from '@assets/types/UI';
import { Footer, Header } from '@resources/components/layout';
import { getCookie, hasCookie } from 'cookies-next';
import { useEffect } from 'react';

const HomeLayout = ({ children, params: { lng } }: PageProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(cartSlice.actions.setItems(hasCookie('cart_products') ? JSON.parse(getCookie('cart_products')!) : []));
        dispatch(cartSlice.actions.calculateCart());
    }, []);

    return (
        <body className='min-h-screen surface-200'>
            <Header lng={lng} />

            <div style={{ paddingTop: 90 }} className='min-h-screen pb-7'>
                {children}
            </div>

            <Footer />
        </body>
    );
};

export default HomeLayout;
