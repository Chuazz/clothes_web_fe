import { MenuItemType } from '@assets/types/menu';
import { TFunction } from 'i18next';
import { FaArrowRightFromBracket, FaUser } from 'react-icons/fa6';
import { LuLANGUAGE_OPTIONS } from 'react-icons/lu';
import { LANGUAGE, LANGUAGE_OPTIONS, ROUTES } from '.';

const getUserMenu = (t: TFunction, lng: string, pathName: string): MenuItemType[] => {
    const currLanguage = LANGUAGE[lng.toUpperCase()].label || t('language');

    return [
        {
            code: 'info',
            parent: 'info',
            label: t('menu:info'),
            icon: <FaUser />,
            to: `/${lng}${pathName || '/home'}`,
        },
        {
            code: lng || 'language',
            parent: lng || 'language',
            label: currLanguage,
            icon: <LuLANGUAGE_OPTIONS />,
            items: LANGUAGE_OPTIONS.map((t) => ({
                ...t,
                parent: 'language',
                to: `/${t.code}${pathName || '/home'}`,
            })),
        },
        {
            code: 'logout',
            parent: 'logout',
            label: t('menu:logout'),
            icon: <FaArrowRightFromBracket />,
            to: `/${lng}/${ROUTES.auth.sign_in}`,
        },
    ];
};

export { getUserMenu };
