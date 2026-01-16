import React, { forwardRef, useEffect, useRef, useState } from 'react';
import cl from './ActionsMenu.module.scss';
import DotsIcon from '../../../assets/images/icons/dotsIcon.svg';
import { MenuActionType } from '@/utils/constants/actionsMenu';

type ActionsMenuProps = {
    actionList: MenuActionType[];
    data?: any;
    setIsOpen?: React.Dispatch<React.SetStateAction<any>>
    isOpen?: any
};

const ActionsMenu = forwardRef<HTMLDivElement, ActionsMenuProps>(
    ({ actionList, data }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement | null>(null);

        const handleMenuClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
        };

        const handleOptionClick = (
            e: React.MouseEvent,
            action?: (data?: any) => void
        ) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);

            if (action) {
                action(data);
            }
        };

        // Закриваємо меню при кліку поза ним
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    menuRef.current &&
                    !menuRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen]);

        return (
            <div
                ref={(node) => {
                    // одночасно пробрасываем ref з forwardRef і наш локальний
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    }
                    menuRef.current = node;
                }}
                className={cl.menuMom}
            >
                <div onClick={handleMenuClick}>
                    <DotsIcon width="24px" height="24px" />
                </div>
                <div className={`${cl.menu} ${isOpen ? cl.open : ''}`}>
                    {actionList.map((action, index) => (
                        <div
                            key={index}
                            className={cl.option}
                            onClick={(e) => handleOptionClick(e, action.action)}
                        >
                            {action.name}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

ActionsMenu.displayName = 'ActionsMenu';

export default ActionsMenu;
