import { request } from '@assets/helpers';
import { ProductCategoryType } from '@assets/interface';
import { useDispatch } from '@assets/redux';
import filterSlice, { initialFilterState } from '@assets/redux/slices/filter/slice';
import { LanguageType } from '@assets/types/lang';
import { LocationType } from '@assets/types/menu';
import { filterSliceType } from '@assets/types/slice';
import { useTranslation } from '@resources/i18n';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';

const Filter = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const dispatch = useDispatch();
    const [params, setParams] = useState<filterSliceType>(initialFilterState);
    const productCategoryQuery = useQuery<ProductCategoryType[]>({
        queryKey: ['productCategory'],
        queryFn: async () => {
            const response = await request.get('/ProductCategory');

            return response.data || [];
        },
    });
    const provinceQuery = useQuery<LocationType[]>({
        queryKey: ['location'],
        queryFn: async () => {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');

            return response.data || [];
        },
    });

    return (
        <div className='bg-white border-round-xl p-3 shadow-5'>
            <div className='flex flex-column gap-3'>
                <div className='flex align-items-center gap-2 text-primary '>
                    <i className='pi pi-filter'></i>
                    <p className='font-semibold text-xl'>{t('search_filter')}</p>
                </div>

                <div className='flex align-items-center gap-2'>
                    <Button
                        label='Xóa bộ lọc'
                        size='small'
                        severity='warning'
                        onClick={() => {
                            setParams(initialFilterState);
                            dispatch(filterSlice.actions.resetFilter());
                        }}
                    />
                    <Button
                        label='Áp dụng'
                        size='small'
                        onClick={() => dispatch(filterSlice.actions.setFilter(params))}
                    />
                </div>
            </div>

            <Divider />

            <div className='flex flex-column gap-3'>
                <div className='flex align-items-center gap-2 text-primary'>
                    <i className='pi pi-dollar'></i>
                    <p className='font-semibold'>{t('price_range')}</p>
                </div>

                <div className='flex align-items-center gap-3'>
                    <InputNumber
                        mode='currency'
                        defaultValue={0}
                        value={params.min_price}
                        currency='VND'
                        locale='vi-VN'
                        placeholder='TỪ'
                        inputClassName='w-full text-sm'
                        onValueChange={(e) => setParams((prev) => ({ ...prev, min_price: e.value || 0 }))}
                    />
                    <InputNumber
                        mode='currency'
                        currency='VND'
                        value={params.max_price === 0 ? null : params.max_price}
                        locale='vi-VN'
                        placeholder='ĐẾN'
                        inputClassName='w-full text-sm'
                        onValueChange={(e) => setParams((prev) => ({ ...prev, max_price: e.value || 0 }))}
                    />
                </div>
            </div>

            <Divider />

            <div className='flex flex-column gap-3'>
                <div className='flex align-items-center gap-2 text-primary'>
                    <i className='pi pi-box'></i>
                    <p className='font-semibold'>{t('category')}</p>
                </div>

                <div className='max-h-16rem flex flex-column gap-3 overflow-auto'>
                    {productCategoryQuery.data &&
                        productCategoryQuery.data.length > 0 &&
                        productCategoryQuery.data.map((t: ProductCategoryType) => {
                            return (
                                <div
                                    key={Math.random().toString()}
                                    className='flex align-items-center gap-2 cursor-pointer hover:text-primary'
                                    onClick={() => {
                                        let nCategoriesCode = params?.categories_code || [];
                                        let find = nCategoriesCode.find(
                                            (productCategoryParam) => productCategoryParam == t.id,
                                        );

                                        if (find) {
                                            setParams((prev) => ({
                                                ...prev,
                                                categories_code: (prev.categories_code || []).filter((t) => t !== find),
                                            }));
                                        } else {
                                            setParams((prev) => ({
                                                ...prev,
                                                categories_code: [...(prev.categories_code || []), t.id],
                                            }));
                                        }
                                    }}
                                >
                                    <Checkbox
                                        name='checkbox_product_category'
                                        checked={!!(params.categories_code || []).find((cc) => cc === t.id)}
                                    />
                                    <label className='block cursor-pointer'>{t.name}</label>
                                </div>
                            );
                        })}
                </div>
            </div>

            <Divider />

            <div className='flex flex-column gap-3'>
                <div className='flex align-items-center gap-2 text-primary'>
                    <i className='pi pi-map-marker'></i>
                    <p className='font-semibold'>{t('shop_address')}</p>
                </div>

                <div className='max-h-16rem flex flex-column gap-3 overflow-auto'>
                    {provinceQuery.data &&
                        provinceQuery.data.length > 0 &&
                        provinceQuery.data.map((t) => (
                            <div
                                key={Math.random().toString()}
                                className='flex align-items-center gap-2 cursor-pointer hover:text-primary'
                                onClick={() => {
                                    let nLocationsCode = params?.locations_code || [];
                                    let find = nLocationsCode.find(
                                        (locationCodeParam) => locationCodeParam == t.codename,
                                    );

                                    if (find) {
                                        setParams((prev) => ({
                                            ...prev,
                                            locations_code: (prev.locations_code || []).filter((t) => t !== find),
                                        }));
                                    } else {
                                        setParams((prev) => ({
                                            ...prev,
                                            locations_code: [...(prev.locations_code || []), t.codename],
                                        }));
                                    }
                                }}
                            >
                                <Checkbox checked={!!(params?.locations_code || []).find((tt) => tt === t.codename)} />
                                <p>{t.name}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Filter;
