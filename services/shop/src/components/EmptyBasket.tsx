import React from 'react';
import iconBasket from '@/assets/images/icons/iconBasket.png'

const EmptyBasket = () => {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexDirection: 'column', 
            textAlign: 'center', 
            height: '100%' 
        }}>
            <img src={iconBasket} alt="iconBasket" style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '16px', fontWeight: '500' }}>Тут поки нічого немає :(</div>
        </div>
        
    );
};

export default EmptyBasket;