import React from 'react';
import cl from './ButtonTrash.module.scss'
import trashIcon from '@packages/shared/src/assets/images/icons/trashIcon.png'

const ButtonTrash = () => {
    return (
        <div className={cl.buttonTrash}>
            <img src={trashIcon} alt='Trash' className={cl.image}/>
            <span className={cl.description}></span>
        </div>
    );
};

export default ButtonTrash;