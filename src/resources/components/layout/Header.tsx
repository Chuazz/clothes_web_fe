import { AUTH_TOKEN, USER } from '@assets/configs';
import { getUserMenu } from '@assets/configs/user_menu';
import { language } from '@assets/helpers';
import { useDispatch, useSelector } from '@assets/redux';
import { selectCart } from '@assets/redux/slices/cart';
import filterSlice from '@assets/redux/slices/filter/slice';
import menuSlice from '@assets/redux/slices/menu/slice';
import { LanguageType } from '@assets/types/lang';
import { MenuItemType } from '@assets/types/menu';
import { useTranslation } from '@resources/i18n';
import { deleteCookie, getCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { MenuItem } from '../UI/MenuItem';
import { sumBy } from 'lodash';

const Header = ({ lng }: LanguageType) => {
    const { t } = useTranslation(lng);
    const [user, setUser] = useState({ name: '' });
    const userModalRef = useRef<OverlayPanel>(null);
    const pathName = usePathname();
    const menu = getUserMenu(t, lng, language.getRealPathName(pathName));
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);

    useEffect(() => {
        setUser(getCookie(AUTH_TOKEN) ? JSON.parse(getCookie(AUTH_TOKEN)!) : '');
    }, []);

    const renderItem = (item: MenuItemType) => {
        const onLogoutClick = () => {
            deleteCookie(AUTH_TOKEN);
            dispatch(menuSlice.actions.onItemClick({ activeItem: 'home', openMenu: false, parent: '' }));
        };

        return (
            <MenuItem
                key={item.code}
                {...item}
                onItemClick={() => {
                    let event = () => {};

                    if (item.code === 'logout') {
                        event = onLogoutClick;
                    }

                    event();
                }}
            />
        );
    };

    const onSearch = useDebouncedCallback((value) => {
        dispatch(filterSlice.actions.setFilter({ keyword: value }));
    }, 800);

    return (
        <div className='flex align-items-center justify-content-between flex-1 h-5rem shadow-1 bg-white px-5 fixed z-5 right-0 left-0'>
            <Link href={`/${lng}/home`} className='flex align-items-center gap-2 col-4'>
                <Avatar label='7' size='large' shape='circle' className='bg-primary' />
                <p className='font-semibold text-xl'>7NoSQL</p>
            </Link>
            {/* <Breadcrumb lng={lng} /> */}

            <div className='col-4 px-3'>
                <div className='p-input-icon-left w-full'>
                    <i className='pi pi-search' />
                    <InputText
                        className='w-full border-round-3xl'
                        placeholder={t('search_product')}
                        onInput={(e) => onSearch(e.currentTarget.value)}
                    />
                </div>
            </div>

            <div className='flex align-items-center justify-content-end gap-2 col-4' style={{ marginRight: '-0.5rem' }}>
                <div className='hover:surface-hover cursor-pointer p-2 border-round-lg'>
                    <Avatar icon='pi pi-bell' shape='circle' className='bg-primary text-white' />
                </div>
                <Link href={`/${lng}/home/cart`} className='hover:surface-hover cursor-pointer p-2 border-round-lg'>
                    <Avatar icon='pi pi-shopping-cart' shape='circle' className='bg-primary text-white p-overlay-badge'>
                        <Badge value={sumBy(cart.products, (t) => t.qty!)} severity='danger' />
                    </Avatar>
                </Link>

                <div
                    className='flex align-items-center gap-2 hover:surface-hover cursor-pointer p-2 border-round-lg'
                    onClick={(e) => userModalRef?.current?.toggle(e)}
                >
                    <Avatar icon='pi pi-user' shape='circle' className='bg-primary text-white' />
                    {user && <p>{user.name}</p>}

                    <i className='pi pi-angle-down ml-2'></i>
                </div>

                <OverlayPanel ref={userModalRef} className='px-2 py-1'>
                    {menu.map(renderItem)}
                </OverlayPanel>
            </div>
        </div>
    );
};

export default Header;
