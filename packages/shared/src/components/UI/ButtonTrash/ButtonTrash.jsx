import React from 'react';
// import cl from ''
import trashIcon from '@packages/shared/src/assets/images/icons/trashIcon.png'

const ButtonTrash = () => {
    return (
        <div>
            <img src={trashIcon}/>
            <span>Видалити</span>
        </div>
    );
};

export default ButtonTrash;