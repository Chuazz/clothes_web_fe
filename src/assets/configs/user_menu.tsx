import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaArrowRightFromBracket, FaBoxesStacked, FaShop } from 'react-icons/fa6';
import { LANGUAGE, ROUTES } from '.';

const getUserMenu = (t: TFunction, lng: string, pathName: string): MenuItemType[] => {
    const currLanguage = LANGUAGE[lng.toUpperCase()].label || t('language');

    return [
        {
            code: 'info',
            parent: 'info',
            label: 'Đơn hàng',
            icon: <FaBoxesStacked />,
            to: `/${lng}/home/order`,
        },
        {
            code: 'follows',
            parent: 'follows',
            label: 'Shop theo dõi',
            icon: <FaShop />,
            to: `/${lng}/home/follows`,
        },
        {
            code: 'logout',
            parent: 'logout',
            label: t('menu:logout'),
            icon: <FaArrowRightFromBracket />,
            to: `/${lng}${ROUTES.auth.sign_in}`,
        },
    ];
};

export { getUserMenu };
