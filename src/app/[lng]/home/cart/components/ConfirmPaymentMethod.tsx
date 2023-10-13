import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import { Controller, useForm } from 'react-hook-form';

interface ConfirmPaymentMethodProps {
    onConfirm: (payment_method: string) => void;
    onBack: () => void;
}

const ConfirmPaymentMethod = ({ onConfirm, onBack }: ConfirmPaymentMethodProps) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            payment_method: '',
        },
    });

    const onSubmit = (data: any) => {
        onConfirm(data.payment_method);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='payment_method'
                control={control}
                rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}
                render={({ field, fieldState }) => (
                    <div className='flex flex-column gap-4'>
                        <div>
                            <RadioButton
                                inputId='cash'
                                {...field}
                                inputRef={field.ref}
                                value='cash'
                                checked={field.value === 'cash'}
                            />
                            <label htmlFor='cash' className='ml-1 mr-3 cursor-pointer'>
                                Thanh toán khi nhận hàng
                            </label>
                        </div>

                        <div>
                            <RadioButton
                                inputId='credit'
                                {...field}
                                value='credit'
                                checked={field.value === 'credit'}
                            />
                            <label htmlFor='credit' className='ml-1 mr-3 cursor-pointer'>
                                Thanh toán qua thẻ tín dụng
                            </label>
                        </div>

                        <small className='text-error'>{fieldState.error?.message}</small>
                    </div>
                )}
            />
            <Divider />

            <div className='flex align-items-center justify-content-between'>
                <Button icon={PrimeIcons.ARROW_LEFT} label='Quay lại' rounded={true} size='small' onClick={onBack} />

                <Button icon={PrimeIcons.CHECK_CIRCLE} label='Xác nhận' rounded={true} size='small' />
            </div>
        </form>
    );
};

export default ConfirmPaymentMethod;
