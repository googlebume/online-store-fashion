import React, { forwardRef } from 'react';
import cl from './ActionsMenu.module.scss'
import DotsIcon from '../../../assets/images/icons/dotsIcon.svg';
import { MenuActionType } from '@/utils/constants/actionsMenu';

type ActionsMenuProps = {
    actionList: MenuActionType[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data?: any;
};

const ActionsMenu = forwardRef<HTMLDivElement, ActionsMenuProps>(
    ({ actionList, setIsOpen, isOpen, data }, ref) => {
        const handleMenuClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        };

        const handleOptionClick = (e: React.MouseEvent, action?: (data?: any) => void) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
            
            if (action) {
                action(data);
            }
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