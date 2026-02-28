import React from 'react';
import cl from './DoubleRangeInput.module.scss';

const DoubleRangeInput = ({ minInRange, maxInRange, setMinPrice, setMaxPrice, minValue, maxValue }) => {

    const minPercent = ((minValue - minInRange) / (maxInRange - minInRange)) * 100;
    const maxPercent = ((maxValue - minInRange) / (maxInRange - minInRange)) * 100;
    return (
        <div className={cl.ranges}>
            <input
                type="range"
                className={cl.ranges__min}
                min={minInRange}
                max={maxInRange}
                value={minValue}
                onChange={e => setMinPrice(Math.min(Number(e.target.value)))}
            />
            <input
                type="range"
                className={cl.ranges__max}
                min={minInRange}
                max={maxInRange}
                value={maxValue}
                onChange={e => setMaxPrice(Math.max(Number(e.target.value)))}
            />

            <div className={cl.ranges__track}>
                <div
                    className={cl.ranges__range}
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default DoubleRangeInput;


