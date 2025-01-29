import React, {useState} from 'react';
import cl from '@/utils/styles/PriceWidget.module.scss'
import PriceInput from './UI/PriceInput/PriceInput';

const PriceWidget = () => {
    const [price, setPrice] = useState('')
    return (
        <div className={cl.price__widget}>
            <div className={cl.price__inputs}>
                <PriceInput 
                    placeholder={'Від'} 
                    value={500}
                    onChange={(e) => setPrice(e.target.value)}/>
                <PriceInput 
                    placeholder={'До'} 
                    value={1000}
                    onChange={(e) => setPrice(e.target.value)}/>
            </div>
        </div>
    );
};

export default PriceWidget;