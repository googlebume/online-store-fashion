import React from 'react';
import cl from './InputOption.module.scss'

type OptionInputType = {
    label: string;
    optionBasic?: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

const InputOption: React.FC<OptionInputType> = ({
    label,
    optionBasic = '',
    options,
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className={cl.selectBlock}>
            <label>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
                <option value="">{optionBasic}</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default InputOption;