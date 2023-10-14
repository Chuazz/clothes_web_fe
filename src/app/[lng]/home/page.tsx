'use client';

import { myString, request } from '@assets/helpers';
import { ProductType } from '@assets/interface';
import { useSelector } from '@assets/redux';
import { selectFilter } from '@assets/redux/slices/filter';
import { PageProps } from '@assets/types/UI';
import Loader from '@resources/components/UI/Loader';
import { Filter } from '@resources/components/layout';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Image } from 'primereact/image';
import { Rating } from 'primereact/rating';
import TextTruncate from 'react-text-truncate';

const HomePage = ({ params: { lng } }: PageProps) => {
    const { t } = useTranslation(lng);
    const filter = useSelector(selectFilter);
    const productQuery = useQuery<ProductType[]>({
        queryKey: ['products', filter],
        queryFn: async () => {
            const response = await request.post('/Product/filter', filter);

            return response.data || [];
        },
    });

    const renderItem = (item: ProductType) => {
        return (
            <div className='col-3' key={Math.random().toString()}>
                <div className='p-1'>
                    <Link
                        className='bg-white border-round-xl shadow-5 overflow-hidden block hover-scale'
                        href={`home/product/${item.id}/?shop_id=${item.shop.id}`}
                    >
                        <Image src={item.image} imageClassName='w-full shadow-1' alt='' />

                        <div className='p-3'>
                            <TextTruncate line={2} containerClassName='pb-2 h-4rem' text={item.name} />

                            <p className='text-primary mb-2'>{myString.formatVNDCurrency(item.price)}</p>

                            <div className='flex align-items-center mb-2 gap-2'>
                                <Rating value={item.rating} cancel={false} readOnly={true} className='start-12' />
                                <p className='text-sm text-600'>{t('sole') + ' ' + item.sole_number}</p>
                            </div>

                            <p className='text-sm text-600'>{item.shop.location}</p>
                        </div>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Loader show={productQuery.isLoading} />

            <div className='flex px-5'>
                <div className='w-19rem pr-3'>
                    <div className='pt-1' style={{ marginTop: 8 }}>
                        <Filter lng={lng} />
                    </div>
                </div>

                <div className='flex-1'>
                    {!productQuery.isLoading && (
                        <div className='flex flex-wrap'>
                            {productQuery.data && productQuery?.data?.length > 0 ? (
                                productQuery?.data?.map(renderItem)
                            ) : (
                                <p className='text-center w-full mt-8 text-red-500 text-xl font-semibold'>
                                    Không tìm thấy sản phẩm theo bộ lọc
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
