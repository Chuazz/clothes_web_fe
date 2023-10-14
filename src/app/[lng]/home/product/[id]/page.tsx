'use client';

import { AUTH_TOKEN, ROUTES } from '@assets/configs';
import { myString, request } from '@assets/helpers';
import { ProductType } from '@assets/interface';
import { useDispatch } from '@assets/redux';
import cartSlice from '@assets/redux/slices/cart/slice';
import { PageProps } from '@assets/types/UI';
import Banner from '@resources/components/UI/Banner';
import Loader from '@resources/components/UI/Loader';
import { InputText } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import moment from 'moment';
import Link from 'next/link';
import { PrimeIcons } from 'primereact/api';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { InputNumber } from 'primereact/inputnumber';
import { Panel } from 'primereact/panel';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import TextTruncate from 'react-text-truncate';

const ProductDetail = ({ params, searchParams }: PageProps) => {
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);
    const { t } = useTranslation(params.lng);
    const { shop_id } = searchParams;
    const [qty, setQty] = useState(1);
    const user = JSON.parse(getCookie(AUTH_TOKEN)!) || {};
    const productDetailQuery = useQuery<ProductType>({
        queryKey: ['product_detail'],
        queryFn: async () => {
            const response = await request.get(`${ROUTES.admin.product}/${params.id}`);

            return response.data;
        },
    });
    const productUpdateMutate = useMutation({
        mutationFn: (data: any) => {
            return request.get(`/Product/${productDetailQuery.data?.id}`, data);
        },
    });
    const { data: shop } = useQuery({
        queryKey: ['shop_detail'],
        queryFn: async () => {
            const response = await request.get(`${ROUTES.admin.shop}/${shop_id}`);

            return response.data;
        },
    });
    const [comment, setComment] = useState('');

    const LeftInfo = () => (
        <Banner>
            {productDetailQuery.data?.images &&
                productDetailQuery.data?.images.length > 0 &&
                productDetailQuery.data?.images.map((image) => (
                    <Image src={image} alt='' key={Math.random().toString()} imageClassName='w-full' />
                ))}
        </Banner>
    );

    const onAddCartProduct = () => {
        dispatch(
            cartSlice.actions.addItem({
                id: productDetailQuery.data?.id,
                image: productDetailQuery.data?.image,
                name: productDetailQuery.data?.name,
                originalPrice: productDetailQuery.data?.price,
                price: productDetailQuery.data?.price,
                rating: productDetailQuery.data?.rating,
                shop_id: productDetailQuery.data?.shop.id,
                shop_name: productDetailQuery.data?.shop.name,
                shop_image: shop?.image,
                qty,
            }),
        );

        dispatch(cartSlice.actions.calculateCart());

        setQty(1);

        toast.current?.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Đã thêm sản phẩm vào giỏ hàng của bạn',
        });
    };

    const RightInfo = () => (
        <div className='flex flex-column h-full justify-content-between'>
            <div className='flex flex-column gap-2'>
                <p className='text-xl font-semibold'>{productDetailQuery.data?.name}</p>

                <div className='flex align-items-center'>
                    <Rating cancel={false} readOnly={true} value={productDetailQuery.data?.rating} />

                    <Divider layout='vertical' style={{ height: 8 }} />

                    <p>{productDetailQuery.data?.comments.length + ' ' + t('feedback')}</p>

                    <Divider layout='vertical' style={{ height: 8 }} />

                    <p>{productDetailQuery.data?.sole_number + ' ' + t('sole')}</p>
                </div>

                <p className='text-primary text-3xl font-semibold'>
                    {myString.formatVNDCurrency(productDetailQuery.data?.price || 0)}
                </p>

                <Divider />

                <div className='flex flex-column gap-4'>
                    <div className='flex'>
                        <p className='text-600 w-10rem'>Chi tiết ngắn</p>

                        <TextTruncate
                            line={2}
                            containerClassName='flex-1 text-justify'
                            truncateText=''
                            textTruncateChild={TruncateChild}
                            text={productDetailQuery.data?.description}
                        />
                    </div>

                    <div className='flex align-items-center'>
                        <p className='text-600 w-10rem'>{t('quantity')}</p>

                        <InputNumber
                            value={qty}
                            disabled={productDetailQuery.data?.in_stock! < 1}
                            onValueChange={(e) => setQty(e.value!)}
                            showButtons={true}
                            min={1}
                            max={productDetailQuery.data?.in_stock}
                            buttonLayout='horizontal'
                            inputClassName='w-3rem text-center'
                            decrementButtonClassName='p-button-secondary'
                            incrementButtonClassName='p-button-secondary'
                            incrementButtonIcon='pi pi-plus'
                            decrementButtonIcon='pi pi-minus'
                        />

                        <p className='pl-3 text-500'>
                            {productDetailQuery.data?.in_stock + ' ' + t('available_product')}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <div className='flex align-items-center justify-content-end gap-3 mb-5'>
                    <Button
                        label={t('buy_now')}
                        icon={PrimeIcons.DOLLAR}
                        disabled={productDetailQuery.data?.in_stock! < 1}
                    />
                    <Button
                        label={t('add_to_cart')}
                        severity='info'
                        icon='pi pi-cart-plus'
                        onClick={onAddCartProduct}
                        disabled={productDetailQuery.data?.in_stock! < 1}
                    />
                </div>

                {productDetailQuery.data?.policies?.split(';').length! > 0 && <Divider />}

                <div className='flex align-items-center justify-content-center'>
                    {productDetailQuery.data &&
                        productDetailQuery.data.policies &&
                        productDetailQuery.data?.policies?.split(';').map((t, index) => (
                            <div key={t} className='flex align-items-center'>
                                <p>{t}</p>
                                {index < productDetailQuery.data.policies?.split(';').length! - 1 && (
                                    <Divider layout='vertical' className='flex-1' />
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );

    const ShopInfo = () => (
        <div className='flex align-items-center'>
            <div className='flex align-items-center gap-3'>
                <Avatar image={shop?.image} shape='circle' size='xlarge' className='shadow-5' />

                <div>
                    <p className='font-semibold text-lg pb-3'>{shop?.name}</p>

                    <div className='flex align-items-center gap-2'>
                        <Button icon='pi pi-tags' size='small' label='Theo dõi' className='p-2' />
                        <Button icon='pi pi-home' size='small' label='Xem shop' className='p-2' />
                    </div>
                </div>
            </div>

            {/* <div className='flex flex-column gap-3'>
                <div className='flex align-items-center'>
                    <p className='w-10rem text-gray-600'>Đánh giá</p>
                    <p className='flex-1 text-red-600 font-semibold text-right'>{shop?.products.length || 0}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-10rem text-gray-600'>Sản phẩm</p>
                    <p className='flex-1 text-red-600 font-semibold text-right'>{shop?.products.length || 0}</p>
                </div>
            </div>

            <Divider layout='vertical' className='px-3' />

            <div className='flex flex-column gap-3'>
                <div className='flex align-items-center'>
                    <p className='w-10rem text-gray-600'>Người theo dõi</p>
                    <p className='flex-1 text-red-600 font-semibold text-right'>{shop?.follows_by.length || 0}</p>
                </div>

                <div className='flex align-items-center'>
                    <p className='w-10rem text-gray-600'>Thời gian phản hồi</p>
                    <p className='flex-1 text-red-600 font-semibold'>trong vài giờ</p>
                </div>
            </div> */}
        </div>
    );

    const CommentItem = (item: any, index: number) => {
        return (
            <div key={Math.random().toString()}>
                <div className='flex align-items-start gap-3'>
                    <Avatar icon='pi pi-user' size='large' shape='circle' />

                    <div className='flex flex-column gap-2'>
                        <p className='text-900 text-primary font-semibold'>{item.user.name}</p>
                        <p className='text-sm text-600'>{moment(item.created_date).format('DD-MM-YYYY hh:mm')}</p>
                        <p className='text-900'>{item.content}</p>

                        <div className='flex align-items-center gap-3 mt-3'>
                            <div className='flex align-items-center gap-1 text-500'>
                                <i className='pi pi-thumbs-up-fill text-sm'></i>
                                <p>{item.like_total}</p>
                            </div>
                            <div className='flex align-items-center gap-1 text-500'>
                                <i className='pi pi-thumbs-down-fill text-sm'></i>
                                <p>{item.dis_like_total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {index < productDetailQuery.data?.comments.length! - 1 && <Divider />}
            </div>
        );
    };

    const onAddComment = () => {
        const commentObject = {
            user: {
                _id: user.id,
                name: user.name,
            },
            content: comment,
            like_total: 0,
            dis_like_total: 0,
            created_date: moment(),
        };

        const nProduct = productDetailQuery.data;

        nProduct?.comments.push(commentObject);

        productUpdateMutate.mutate(nProduct, {
            onSuccess() {
                setComment('');
            },
        });
    };

    const ProductInfo = () => (
        <div className='flex flex-column gap-4'>
            <Panel header='CHI TIẾT SẢN PHẨM' toggleable={true} collapsed={false}>
                <div className='flex flex-column gap-3'>
                    {productDetailQuery.data?.properties.map((t) => (
                        <div key={t.value} className='flex align-items-center'>
                            <p className='w-12rem'>{t.name}</p>
                            <p className='text-900'>{t.value}</p>
                        </div>
                    ))}
                </div>
            </Panel>

            <Panel header='MÔ TẢ SẢN PHẨM' toggleable={true} collapsed={false} id='product_description'>
                <p>{productDetailQuery.data?.description}</p>
            </Panel>

            <Panel header='ĐÁNH GIÁ SẢN PHẨM' toggleable={true} collapsed={false}>
                <div className='max-h-27rem overflow-auto'>{productDetailQuery.data?.comments.map(CommentItem)}</div>

                <Divider />

                <div className='flex align-items-start gap-3'>
                    <Avatar icon='pi pi-user' size='large' shape='circle' />

                    <div className='flex flex-column gap-2 flex-1'>
                        <p className='text-900 text-primary font-semibold'>{user.name}</p>

                        <span className='p-input-icon-right'>
                            <i className='pi pi-send hover:text-primary cursor-pointer' onClick={onAddComment} />

                            <InputText
                                id='comment'
                                placeholder='Thêm bình luận'
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                            />
                        </span>
                    </div>
                </div>
            </Panel>
        </div>
    );

    const TruncateChild: any = (
        <Link href='#product_description' className='text-primary text-sm'>
            ...Xem thêm
        </Link>
    );

    return (
        <>
            <Toast ref={toast} />
            <Loader show={productDetailQuery.isLoading || productUpdateMutate.isLoading} />

            {productDetailQuery.data && (
                <div className='px-5 flex flex-column gap-4'>
                    <div className='flex bg-white border-round p-4'>
                        <div className='col-6'>{LeftInfo()}</div>

                        <div className='col-6'>{RightInfo()}</div>
                    </div>

                    <div className='bg-white border-round p-4'>{ShopInfo()}</div>

                    <div className='bg-white border-round p-4'>{ProductInfo()}</div>
                </div>
            )}
        </>
    );
};

export default ProductDetail;
