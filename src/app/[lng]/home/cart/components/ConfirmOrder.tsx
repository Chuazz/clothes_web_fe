import { myString } from '@assets/helpers';
import { useSelector } from '@assets/redux';
import { selectCart } from '@assets/redux/slices/cart';
import cartSlice from '@assets/redux/slices/cart/slice';
import { CartProductType } from '@assets/types/cart';
import Link from 'next/link';
import { PrimeIcons } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useDispatch } from 'react-redux';

interface ConfirmOrderProps {
    lng: string;
    onConfirm: () => void;
}

const ConfirmOrder = ({ lng, onConfirm }: ConfirmOrderProps) => {
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);

    const orderItemTemplate = (product: CartProductType, index: number) => {
        return product.on_order ? (
            <div key={product.id + Math.random().toString()}>
                <div className='flex flex-column gap-3'>
                    <div className='flex align-content-start justify-content-between gap-3'>
                        <Link
                            href={`/${lng}/home/product/${product.id}`}
                            className='text-900 font-semibold hover:text-primary'
                        >
                            {product.name}
                        </Link>
                        <Badge
                            value='X'
                            severity='danger'
                            className='cursor-pointer'
                            onClick={() => {
                                dispatch(cartSlice.actions.updateItem({ ...product, on_order: false }));
                                dispatch(cartSlice.actions.calculateCart());
                            }}
                        />
                    </div>

                    <div className='flex align-items-center gap-5 justify-content-between'>
                        <p className='w-5rem'>Số lượng </p>
                        <p>{product.qty}</p>
                    </div>

                    <div className='flex align-items-center gap-5 justify-content-between'>
                        <p className='w-5rem'>Đơn giá</p>
                        <p>{myString.formatVNDCurrency(product.original_price!)}</p>
                    </div>

                    <div className='flex align-items-center gap-5 justify-content-between'>
                        <p className='w-5rem'>Tổng tiền</p>
                        <p className='font-semibold text-primary'>{myString.formatVNDCurrency(product.price!)}</p>
                    </div>
                </div>

                <Divider className={classNames({ 'py-2': index < cart.products.length - 1 })} />
            </div>
        ) : null;
    };
    return (
        <>
            <div className='flex flex-column'>{cart.products.map(orderItemTemplate)}</div>

            {cart.products.filter((t) => t.on_order).length > 0 && (
                <div className='flex align-items-center justify-content-between'>
                    <p className='font-semibold'>Thành tiền</p>

                    <p className='font-semibold text-primary text-lg'>{myString.formatVNDCurrency(cart.total_price)}</p>
                </div>
            )}

            <Divider />

            <div className='flex align-items-center justify-content-end pt-2'>
                <Button
                    icon={PrimeIcons.CHECK_CIRCLE}
                    label='Xác nhận'
                    rounded={true}
                    size='small'
                    onClick={onConfirm}
                />
            </div>
        </>
    );
};

export default ConfirmOrder;
