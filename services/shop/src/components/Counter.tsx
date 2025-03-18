import React, { useState } from 'react';
import CountControl from './UI/CountControl/CountControl';

const Counter = () => {
    const [count, setcount] = useState(1);
    const onMinus = () => {
        Number.isInteger(count) && count > 1 ? setcount(count - 1) : null;
    }
    const onPlus = () => {
        setcount(count + 1)
    }

    return (
        <div>
            <CountControl onClick={onMinus}> - </CountControl>
            <span style={{padding: '0 8px'}}>{count}</span>
            <CountControl onClick={onPlus}> + </CountControl>
        </div>
    );
};

export default Counter;