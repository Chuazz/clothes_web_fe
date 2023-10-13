import React from 'react';

interface MenuItemType {
    parent?: string;
    code: string;
    label: string;
    items?: MenuItemType[];
    icon?: React.JSX.Element;
    to?: string;
    itemClassName?: string;
    labelClassName?: string;
    iconClassName?: string;
    onItemClick?: (item: MenuItemType) => void;
    onSubItemClick?: (item: MenuItemType) => void;
}

interface LocationType {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
}

export type { MenuItemType, LocationType };
