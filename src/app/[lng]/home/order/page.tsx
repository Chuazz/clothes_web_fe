'use client';

import { AUTH_TOKEN } from '@assets/configs';
import { myString, request } from '@assets/helpers';
import Loader from '@resources/components/UI/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import { InputTextarea } from 'primereact/inputtextarea';
import { Panel } from 'primereact/panel';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const ORDER_STATUS: any = {
    n: 'Chờ xác nhận',
    c: 'Đã hủy',
    r: 'Đang chuẩn bị hàng',
    dy: 'Đang giao',
    de: 'Đã giao',
};

const OrderPage = () => {
    const user = JSON.parse(getCookie(AUTH_TOKEN)!) || {};
    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});
    const ToastRef = useRef<Toast>(null);

    const updateOrderMutate = useMutation({
        mutationFn: (data: any) => {
            return request.update(`/Order/${data.id}`, data);
        },
    });

    const orderQuery = useQuery({
        queryKey: ['order'],
        queryFn: async () => {
            const response = await request.get(`/Order/user/${user.id}`);

            return response.data;
        },
    });

    const queryClient = useQueryClient();

    const { control, handleSubmit, clearErrors } = useForm({
        defaultValues: {
            reason: 'Mua sản phẩm khác',
        },
    });

    const ProductItem = (item: any, index: number, products: any[]) => {
        return (
            <>
                <div key={Math.random().toString()} className='flex gap-3'>
                    <Image src={item.image} alt='' width='100' imageClassName='border-round shadow-4' />

                    <div className='flex flex-column justify-content-between py-1 '>
                        <p className='hover:text-primary cursor-pointer text-900'>{item.name}</p>

                        <p className='font-semibold text-600'>Số lượng: {item.qty}</p>
                    </div>
                </div>

                {index < products.length - 1 && <Divider />}
            </>
        );
    };

    const OrderItem = (item: any) => {
        const HeaderTemplate: any = () => {
            let bgColor = item.status.toLowerCase();

            if (bgColor === 'n') {
                bgColor = 'bg-gray-700';
            } else if (bgColor === 'c') {
                bgColor = 'bg-red-600';
            } else if (bgColor === 'p') {
                bgColor = 'bg-primary';
            } else if (bgColor === 'dy') {
                bgColor = 'bg-orange-500';
            } else if (bgColor === 'de') {
                bgColor = 'bg-green-600';
            }

            return (
                <div className='flex align-items-center gap-5 font-semibold' id={item.id}>
                    <p className='flex-1'>Mã đơn hàng: {item.id}</p>

                    <p>{moment(item.created_date).format('DD-MM-YYYY HH:mm')}</p>

                    <Tag value={ORDER_STATUS[item.status.toLowerCase()]} className={bgColor} />

                    <Tag value={myString.formatVNDCurrency(item.orderTotal)} className='primary' />
                </div>
            );
        };

        return (
            <Panel key={item.id} header={HeaderTemplate} toggleable={true} collapsed={true}>
                <div className='flex align-content-center justify-content-between p-3 border-round bg-pink-50 mb-3 '>
                    <div className='flex align-items-center gap-2'>
                        <Image src={item.shop.image} alt='' width='45' imageClassName='border-circle' />
                        <p className='text-900 font-semibold hover:text-primary cursor-pointer'>{item.shop.name}</p>
                    </div>

                    {item.status === 'N' && (
                        <Button
                            label='Hủy đơn'
                            severity='danger'
                            size='small'
                            onClick={() => {
                                setVisible(true);
                                setItem(item);
                            }}
                        />
                    )}
                </div>

                <Splitter className='gap-3 p-3'>
                    <SplitterPanel>
                        <div className='flex flex-column gap-2'>
                            {item.products.map((product: any, index: number) =>
                                ProductItem(product, index, item.products),
                            )}
                        </div>
                    </SplitterPanel>

                    <SplitterPanel size={5}>
                        <div className='flex flex-wrap gap-3'>
                            <p className='font-semibold w-8rem text-900'>Người nhận</p>
                            <p className='flex-1'>{item.contact.name}</p>
                        </div>
                        <div className='flex flex-wrap gap-3 mt-3'>
                            <p className='font-semibold w-8rem text-900'>Số điện thoại</p>
                            <p className='flex-1'>{item.contact.phone_number}</p>
                        </div>
                        <div className='flex flex-wrap gap-3 mt-3'>
                            <p className='font-semibold w-8rem text-900'>Địa chỉ</p>
                            <p className='flex-1'>{item.contact.address}</p>
                        </div>
                        {item?.contact?.note && (
                            <div className='flex flex-wrap gap-3 mt-3'>
                                <p className='font-semibold w-8rem text-900'>Ghi chú </p>
                                <p className='flex-1'>{item.contact.note}</p>
                            </div>
                        )}
                    </SplitterPanel>
                </Splitter>
            </Panel>
        );
    };

    const onConfirmCancel = (data: any) => {
        updateOrderMutate.mutate(
            { ...item, status: 'C', refuse: { message: data.reason } },
            {
                onSuccess() {
                    setVisible(false);
                    ToastRef.current?.show({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Hủy đơn hàng thành công',
                    });

                    queryClient.refetchQueries(['order']);
                },
            },
        );
    };

    const ConfirmCancelForm = () => {
        return (
            <form onSubmit={handleSubmit(onConfirmCancel)}>
                <Controller
                    name='reason'
                    control={control}
                    rules={{ required: 'Vui lòng nhập lý do hủy' }}
                    render={({ field, fieldState }) => (
                        <div className='flex gap-3'>
                            <p className='w-6rem pt-2 font-semibold text-900'>Lý do hủy</p>

                            <div className='flex-1'>
                                <InputTextarea
                                    id={field.name}
                                    {...field}
                                    rows={4}
                                    cols={30}
                                    className={classNames('w-full', { 'p-invalid': fieldState.error })}
                                />
                                {fieldState.error && (
                                    <small className='block text-error'>{fieldState.error.message}</small>
                                )}
                            </div>
                        </div>
                    )}
                />
                <div className='flex justify-content-end mt-4'>
                    <Button
                        label='Hủy'
                        icon='pi pi-times'
                        onClick={() => {
                            setVisible(false);
                            clearErrors('reason');
                        }}
                        className='p-button-text'
                    />
                    <Button label='Đồng ý' icon='pi pi-check' autoFocus />
                </div>
            </form>
        );
    };

    return (
        <div className='pt-9 px-5'>
            <Toast ref={ToastRef} />
            <Dialog
                header='Xác nhận hủy đơn hàng !'
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => {
                    setVisible(false);
                    clearErrors('reason');
                }}
            >
                <ConfirmCancelForm />
            </Dialog>
            <Loader show={orderQuery.isLoading} />
            <div className='border-round bg-white p-3'>
                <p className='font-semibold text-lg pb-4'>Đơn hàng của bạn</p>

                <div className='flex flex-column gap-4'>
                    {orderQuery.data && orderQuery.data.length > 0 && orderQuery.data.map(OrderItem)}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
