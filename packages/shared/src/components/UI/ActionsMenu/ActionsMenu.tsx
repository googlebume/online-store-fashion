import React, { forwardRef } from 'react';
import cl from './ActionsMenu.module.scss'
import DotsIcon from '../../../assets/images/icons/dotsIcon.svg';
import { MenuActionType } from '@/utils/constants/actionsMenu';

type ActionsMenuProps<T extends MenuActionType> = {
    actionList: T[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data?: T
};

const ActionsMenu = forwardRef<HTMLDivElement, ActionsMenuProps<MenuActionType>>(
    ({ actionList, setIsOpen, isOpen }, ref) => {
        const handleMenuClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        };

        const handleOptionClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
        };

        return (
            <div 
                ref={ref}
                className={cl.menuMom}
                onClick={handleMenuClick}
            >
                <DotsIcon width="24px" height="24px" />
                <div className={`${cl.menu} ${isOpen && cl.open}`}>
                    {actionList.map((action, index) => (
                        <div 
                            key={index} 
                            className={cl.option}
                            onClick={handleOptionClick}
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