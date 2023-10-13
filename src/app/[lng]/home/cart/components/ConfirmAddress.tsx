import { AUTH_TOKEN } from '@assets/configs';
import { useDispatch, useSelector } from '@assets/redux';
import { selectCart } from '@assets/redux/slices/cart';
import cartSlice from '@assets/redux/slices/cart/slice';
import { UserType } from '@assets/types/cart';
import { getCookie } from 'cookies-next';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';

interface ConfirmAddressProps {
    onConfirm: () => void;
    onBack: () => void;
}

const ConfirmAddress = ({ onBack, onConfirm }: ConfirmAddressProps) => {
    const cart = useSelector(selectCart);
    const user: UserType = cart.user || JSON.parse(getCookie(AUTH_TOKEN)!);
    const { control, handleSubmit } = useForm({ defaultValues: user });
    const dispatch = useDispatch();

    const onSubmit = (data: UserType) => {
        dispatch(cartSlice.actions.setUserInfo(data));
        onConfirm();
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-5'>
                    <Controller
                        name='name'
                        control={control}
                        rules={{ required: 'Họ và tên là bắt buộc' }}
                        render={({ field, fieldState }) => (
                            <div>
                                <label
                                    htmlFor={field.name}
                                    className={classNames({ 'p-error': fieldState.error })}
                                ></label>
                                <span className='p-float-label'>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames('w-full', { 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <label htmlFor={field.name}>
                                        Họ và tên <span className='text-error'>(⁎)</span>
                                    </label>
                                </span>

                                <small id={field.name} className='text-error'>
                                    {fieldState.error?.message}
                                </small>
                            </div>
                        )}
                    />

                    <Controller
                        name='phone_number'
                        control={control}
                        rules={{ required: 'Số điện thoại là bắt buộc' }}
                        render={({ field, fieldState }) => (
                            <div>
                                <label
                                    htmlFor={field.name}
                                    className={classNames({ 'p-error': fieldState.error })}
                                ></label>
                                <span className='p-float-label'>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames('w-full', { 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <label htmlFor={field.name}>
                                        Số điện thoại <span className='text-error'>(⁎)</span>
                                    </label>
                                </span>

                                <small id={field.name} className='text-error'>
                                    {fieldState.error?.message}
                                </small>
                            </div>
                        )}
                    />

                    <Controller
                        name='address'
                        control={control}
                        rules={{ required: 'Địa chỉ là bắt buộc' }}
                        render={({ field, fieldState }) => (
                            <div>
                                <label
                                    htmlFor={field.name}
                                    className={classNames({ 'p-error': fieldState.error })}
                                ></label>
                                <span className='p-float-label'>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames('w-full', { 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <label htmlFor={field.name}>
                                        Địa chỉ <span className='text-error'>(⁎)</span>
                                    </label>
                                </span>

                                <small id={field.name} className='text-error'>
                                    {fieldState.error?.message}
                                </small>
                            </div>
                        )}
                    />

                    <Controller
                        name='note'
                        control={control}
                        render={({ field, fieldState }) => (
                            <div>
                                <label
                                    htmlFor={field.name}
                                    className={classNames({ 'p-error': fieldState.error })}
                                ></label>
                                <span className='p-float-label'>
                                    <InputTextarea
                                        id={field.name}
                                        {...field}
                                        rows={4}
                                        cols={30}
                                        className={classNames('w-full', { 'p-invalid': fieldState.error })}
                                    />
                                    <label htmlFor={field.name}>Ghi chú</label>
                                </span>

                                <small id={field.name} className='text-error'>
                                    {fieldState.error?.message}
                                </small>
                            </div>
                        )}
                    />
                </div>

                <Divider />

                <div className='flex align-items-center justify-content-between'>
                    <Button
                        icon={PrimeIcons.ARROW_LEFT}
                        label='Quay lại'
                        rounded={true}
                        size='small'
                        onClick={(e) => {
                            onBack();
                        }}
                    />

                    <Button icon={PrimeIcons.CHECK_CIRCLE} label='Xác nhận' rounded={true} size='small' />
                </div>
            </form>
        </div>
    );
};

export default ConfirmAddress;
