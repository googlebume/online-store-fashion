import React, { useState } from 'react';
import cl from './ActionsMenu.module.scss'
import DotsIcon from '../../../assets/images/icons/dotsIcon.svg';
import { adminProductsAction, MenuActionType } from '@/utils/constants/actionsMenu';

type ActionsMenuProps<T extends MenuActionType> = {
    actionList: T[];
};


const ActionsMenu = <T extends MenuActionType>({ actionList }: ActionsMenuProps<T>) => {
    const [isOpen, setIsOpen] = useState<boolean>(false) 


    return (
        <div 
            className={cl.menuMom}
            onClick={e => setIsOpen(!isOpen)}>
            <DotsIcon width="24px" height="24px" />
            <div className={`${cl.menu} ${isOpen && cl.open}`}>
                {actionList.map((action, index) => (
                    <div 
                        key={index} 
                        className={cl.option}
                    >{action.name}</div>
                ))}
            </div>
        </div>
    );
};


export default ActionsMenu;