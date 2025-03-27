import React from 'react';
import cl from './ButtonTrash.module.scss'
import trashIcon from '@packages/shared/src/assets/images/icons/trashIcon.png'
import { randomInt } from 'crypto';

interface ButtonTrashI {
    onClick?: () => void;
    setSummaryRenderEvent?: React.Dispatch<React.SetStateAction<number>>;
}

const ButtonTrash: React.FC<ButtonTrashI> = ({ onClick, setSummaryRenderEvent }) => {
    return (
        <div className={cl.buttonTrash} onClick={() => { onClick?.(); setSummaryRenderEvent?.(Math.floor(Math.random() * 3)) }}>

            <img src={trashIcon} alt='Trash' className={cl.image} />
            <span className={cl.description}></span>
        </div>
    );
};

export default ButtonTrash;