import React, { ReactNode } from 'react';

interface PageProps {
    params: any;
    searchParams?: any;
    children?: ReactNode;
}

interface BreadcrumbProps {
    label: string;
    url: string;
    icon?: string;
}

interface LoaderProps {
    label?: string;
    show?: boolean;
}

interface BannerProps {
    numScroll?: number;
    numVisible?: number;
    showNavigators?: boolean;
    showIndicators?: boolean;
    delay?: number;
    nextBtnClassName?: string;
    prevBtnClassName?: string;
    actionOutside?: boolean;
    children: any;
}

export type { PageProps, BreadcrumbProps, LoaderProps, BannerProps };
