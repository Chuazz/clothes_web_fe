'use client';

import { AUTH_TOKEN, ROUTES, TOKEN_EXPIRE } from '@assets/configs';
import { language, request } from '@assets/helpers';
import { PageProps } from '@assets/types/UI';
import { yupResolver } from '@hookform/resolvers/yup';
import Loader from '@resources/components/UI/Loader';
import { InputText, Password } from '@resources/components/form';
import { useTranslation } from '@resources/i18n';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const Page = ({ params: { lng } }: PageProps) => {
    const router = useRouter();
    const pathName = usePathname();
    const { t } = useTranslation(lng);
    const schema = yup.object({
        name: yup.string().required('Trường họ tên là bắt buộc'),
        account: yup.string().required(t('validation:required', { attribute: t('account').toLowerCase() })),
        password: yup
            .string()
            .min(3, 'Ít nhất 3 ký tự')
            .required(t('validation:required', { attribute: t('password').toLowerCase() })),
        phone_number: yup.string(),
        address: yup.string(),
        email: yup.string(),
        roll: yup.string(),
        follows: yup.array(),
        shop: yup.object(),
        confirm_password: yup
            .string()
            .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
            .required('Trường mật khẩu là bắt buộc'),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            account: '',
            password: '',
            confirm_password: '',
            address: '',
            phone_number: '',
            email: '',
            follows: [],
            roll: 'user',
            shop: {},
        },
    });
    const signUpMutation = useMutation({
        mutationFn: (data: any) => {
            return request.post('/Auth/create_account', data);
        },
    });

    const onSubmit = (data: any) => {
        signUpMutation.mutate(data, {
            onSuccess(response) {
                let user = response.data;

                setCookie(AUTH_TOKEN, user, { expires: TOKEN_EXPIRE });

                router.push(language.addPrefixLanguage(lng, ROUTES.admin.home));
            },
        });
    };

    const onLanguageChange = (e: DropdownChangeEvent) => {
        router.push(language.createNewPath(e.value, pathName));
    };

    return (
        <div className='flex align-items-center justify-content-center h-full w-full'>
            <div
                className='flex flex-wrap shadow-2 border-round-2xl overflow-hidden bg-white p-5'
                style={{ width: '40vw' }}
            >
                <Loader show={signUpMutation.isLoading} />

                <div className='flex-1'>
                    <div className='flex align-items-center justify-content-between mb-5'>
                        <div className='flex align-items-center gap-2'>
                            <Avatar label='7' size='large' shape='circle' className='bg-primary' />
                            <p className='font-semibold text-xl'>7NoSQL</p>
                        </div>
                        <span className='text-2xl font-semibold text-900'>Tạo tài khoản</span>
                        {/* <a
							tabIndex={0}
							className='font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-150'
						>
							Sign up
						</a> */}
                    </div>
                    <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field, formState }) => (
                                <InputText
                                    id='name'
                                    value={field.value}
                                    label={'Họ và tên'}
                                    placeholder={'Họ và tên'}
                                    errorMessage={formState.errors.name?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                        <Controller
                            name='account'
                            control={control}
                            render={({ field, formState }) => (
                                <InputText
                                    id='account'
                                    value={field.value}
                                    label={t('account')}
                                    placeholder={t('account')}
                                    errorMessage={formState.errors.account?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name='password'
                            control={control}
                            render={({ field, formState }) => (
                                <Password
                                    id='password'
                                    value={field.value}
                                    label={t('password')}
                                    placeholder={t('password')}
                                    errorMessage={formState.errors.password?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />

                        <Controller
                            name='confirm_password'
                            control={control}
                            render={({ field, fieldState }) => (
                                <Password
                                    id='confirm_password'
                                    value={field.value}
                                    label={'Xác nhận mật khẩu'}
                                    placeholder={'Xác nhận mật khẩu'}
                                    errorMessage={fieldState.error?.message}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                        <div className='flex align-items-center justify-content-between'>
                            <div>
                                {signUpMutation.isError && <small className='text-error'>Người dùng đã tồn tại</small>}
                                {/* <Controller
								name='remember_password'
								control={control}
								render={({ field }) => (
									<Checkbox
										id='remember_password'
										value={field.value}
										label={t('remember_password')}
										onChange={(e) => field.onChange(e.checked)}
									/>
								)}
							/> */}
                            </div>
                        </div>

                        <Button label={'Đăng ký'} className='w-full font-medium py-3 ' rounded={true} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
