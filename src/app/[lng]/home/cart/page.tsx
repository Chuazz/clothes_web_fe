'use client';

import { myString, request } from '@assets/helpers';
import { useSelector } from '@assets/redux';
import { selectCart } from '@assets/redux/slices/cart';
import cartSlice from '@assets/redux/slices/cart/slice';
import { PageProps } from '@assets/types/UI';
import { CartProductType } from '@assets/types/cart';
import Link from 'next/link';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { MenuItem } from 'primereact/menuitem';
import { Panel } from 'primereact/panel';
import { Rating } from 'primereact/rating';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Steps } from 'primereact/steps';
import { classNames } from 'primereact/utils';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConfirmAddress from './components/ConfirmAddress';
import ConfirmOrder from './components/ConfirmOrder';
import ConfirmPaymentMethod from './components/ConfirmPaymentMethod';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { AUTH_TOKEN } from '@assets/configs';
import Loader from '@resources/components/UI/Loader';
import moment from 'moment';
import { Toast } from 'primereact/toast';

const CartPage = ({ params: { lng } }: PageProps) => {
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef<Toast>(null);
    const [title, setTitle] = useState('Thông tin đơn hàng');
    const items: MenuItem[] = [
        {
            label: 'Xác nhận',
            command() {
                setTitle('Thông tin đơn hàng');
            },
        },
        {
            label: 'Địa chỉ',
            command() {},
        },
        {
            label: 'Thanh toán',
            command() {
                setTitle('Phương thức thanh toán');
            },
        },
    ];
    const createOrderMutation = useMutation({
        mutationFn: (data: any) => {
            return request.post('/Order', data);
        },
    });

    const cartItemTemplate = (product: CartProductType, index: number) => {
        return product.onOrder ? null : (
            <div
                className={classNames('flex p-4 gap-4 p-overlay-badge border-top-1 border-red-500')}
                key={product.id + Math.random().toString()}
            >
                <Image imageClassName='w-10rem shadow-2 block border-round' src={product.image!} alt='' />

                <div className='flex flex-column justify-content-between flex-1'>
                    <Link
                        href={`/${lng}/home/product/${product.id}`}
                        className='text-lg font-semibold text-900 hover:text-primary'
                    >
                        {product.name}
                        <span className='text-red-500'> x{product.qty}</span>
                    </Link>

                    <div className='flex align-items-end justify-content-between w-full'>
                        <div className='flex flex-column gap-2'>
                            <Rating value={product.rating} readOnly cancel={false}></Rating>
                            <span className='flex align-items-center gap-2'>
                                <i className='pi pi-tag'></i>
                                <span className='font-semibold text-xl'>
                                    {myString.formatVNDCurrency(product.price!)}
                                </span>
                            </span>
                        </div>

                        <Button
                            label='Thanh toán'
                            icon='pi pi-arrow-right'
                            iconPos='right'
                            rounded={true}
                            size='small'
                            onClick={() => {
                                dispatch(cartSlice.actions.updateItem({ ...product, onOrder: true }));
                                dispatch(cartSlice.actions.calculateCart());
                            }}
                        />
                    </div>
                </div>

                <Badge
                    value='X'
                    severity='danger'
                    className='cursor-pointer'
                    onClick={() => {
                        dispatch(cartSlice.actions.removeItem(product));
                        dispatch(cartSlice.actions.calculateCart());
                    }}
                />
            </div>
        );
    };

    const onConfirmMethod = (method: string) => {
        const user = JSON.parse(getCookie(AUTH_TOKEN)!);

        cart.productsByShop.forEach((product) => {
            const data: any = {
                payment_method: method,
                status: 'N',
                orderTotal: product.totalPrice,
                shop: {
                    id: product.shop_id,
                    name: product.shop_name,
                    image: product.shop_image,
                },
                contact: cart.user,
                user: {
                    id: user.id,
                    name: user.name,
                },
                products: product.products,
                created_date: moment(),
            };

            createOrderMutation.mutate(data, {
                onSuccess() {
                    dispatch(cartSlice.actions.setItems(cart.products.filter((t) => !t.onOrder)));
                    setActiveIndex(0);
                    setTitle('Thông tin đơn hàng');
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Thông báo',
                        detail: 'Đơn hàng của bạn sẽ được xem xét và xác nhận trong thời gian sớm nhất',
                    });
                },
                onError() {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Thông báo',
                        detail: 'Đã xảy ra lỗi khi tạo đơn hàng',
                    });
                },
            });
        });
    };

    return (
        <div className='px-5 flex'>
            <Loader show={createOrderMutation.isLoading} />

            <Toast ref={toast} />

            <Splitter className='w-full gap-3 p-3'>
                <SplitterPanel size={70}>
                    <Panel header='Giỏ hàng của bạn' toggleable={true}>
                        {cart.products.map(cartItemTemplate)}
                    </Panel>
                </SplitterPanel>
                <SplitterPanel size={50}>
                    <Panel header={title}>
                        {cart.products.filter((t) => t.onOrder).length > 0 && (
                            <>
                                <Steps
                                    model={items}
                                    activeIndex={activeIndex}
                                    onSelect={(e) => setActiveIndex(e.index)}
                                    className='pb-5'
                                />

                                {activeIndex === 0 && (
                                    <ConfirmOrder
                                        lng={lng}
                                        onConfirm={() => {
                                            setActiveIndex(1);
                                            setTitle('Thông tin người nhận');
                                            dispatch(cartSlice.actions.splitOrder());
                                        }}
                                    />
                                )}

                                {activeIndex === 1 && (
                                    <ConfirmAddress
                                        onBack={() => {
                                            setActiveIndex(0);
                                            setTitle('Thông tin đơn hàng');
                                        }}
                                        onConfirm={() => {
                                            setActiveIndex(2);
                                            setTitle('Phương thức thanh toán');
                                        }}
                                    />
                                )}

                                {activeIndex === 2 && (
                                    <ConfirmPaymentMethod
                                        onBack={() => {
                                            setActiveIndex(1);
                                            setTitle('Thông tin người nhận');
                                        }}
                                        onConfirm={onConfirmMethod}
                                    />
                                )}
                            </>
                        )}
                    </Panel>
                </SplitterPanel>
            </Splitter>
        </div>
    );
};

export default CartPage;
