'use client';

import styles from './MenuItem.module.scss';

import { useDispatch, useSelector } from '@assets/redux';
import { selectMenu } from '@assets/redux/slices/menu';
import menuSlice from '@assets/redux/slices/menu/slice';
import { MenuItemType } from '@assets/types/menu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import { useState } from 'react';

const MenuItem = (item: MenuItemType) => {
	const {
		parent,
		to,
		code,
		icon,
		items,
		label,
		labelClassName,
		iconClassName,
		itemClassName,
		onItemClick,
		onSubItemClick,
	} = item;
	const Icon = () => icon;
	const dispatch = useDispatch();
	const menu = useSelector(selectMenu);
	const active = code === menu.activeItem;
	const [isOpenMenu, setIsOpenMenu] = useState(false);

	const onClick = (currItem: MenuItemType) => {
		if (items && items.length > 0) {
			if (active) {
				dispatch(
					menuSlice.actions.onItemClick({
						activeItem: '',
						parent: '',
						openMenu: isOpenMenu && menu.openMenu,
					}),
				);
				setIsOpenMenu(false);
			} else {
				dispatch(
					menuSlice.actions.onItemClick({
						activeItem: code,
						parent,
						openMenu: isOpenMenu && menu.openMenu,
					}),
				);
				setIsOpenMenu(true);
			}
		} else if (parent) {
			dispatch(
				menuSlice.actions.onItemClick({
					activeItem: code,
					parent,
					openMenu: false,
				}),
			);
		} else {
			dispatch(menuSlice.actions.onItemClick({ activeItem: code, parent, openMenu: false }));
			setIsOpenMenu(false);
		}

		onItemClick?.(currItem);
	};

	const SubItem = () => {
		return (
			<ul>
				{items?.map((child) => {
					return (
						<MenuItem
							key={child.label}
							code={child.code}
							label={child.label}
							icon={child.icon}
							to={child.to}
							itemClassName='ml-2'
							iconClassName='hidden'
							parent={child.parent}
							onItemClick={onSubItemClick}
						/>
					);
				})}
			</ul>
		);
	};

	return (
		<div className='my-1'>
			<Link
				className={classNames(
					'flex align-items-center gap-2 py-2 px-3 no-underline cursor-pointer transition-linear transition-duration-200 border-round-lg',
					styles['menu-item'],
					itemClassName,
					{
						'hover:surface-hover': !active,
						'text-900': !active,
						'bg-highlight': code === menu.activeItem,
						'text-highlight': code === menu.activeItem,
					},
				)}
				href={to || ''}
				onClick={() => onClick(item)}
			>
				<div className={classNames('p-1', iconClassName)}>
					<Icon />
				</div>
				<p className={classNames('flex-1 text-sm font-semibold', styles['item-label'], labelClassName)}>
					{label}
				</p>

				{items && items.length > 0 && <i className='pi pi-chevron-down text-sm'></i>}
			</Link>

			<motion.div
				animate={
					(isOpenMenu && active) || (isOpenMenu && menu.openMenu) || parent === menu.parent
						? { height: 'auto' }
						: { height: 0 }
				}
				transition={{ duration: 0.3 }}
				className={classNames(styles['sub-menu'], 'overflow-hidden my-1 border-left-1 border-300')}
			>
				{<SubItem />}
			</motion.div>
		</div>
	);
};

export default MenuItem;
