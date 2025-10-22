import React from 'react';
import cl from './InputOption.module.scss'

type OptionInputType = {
    label: string;
    optionBasic?: string;
    options: string[];
    value: string;
    onChange: (value: string) => void | React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    required?: boolean;
};

const InputOption: React.FC<OptionInputType> = ({
    label,
    optionBasic = '',
    options,
    value,
    onChange,
    disabled = false,
    required = true
}) => {
    return (
        <div className={cl.selectBlock}>
            <label>{label}</label>
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                disabled={disabled}
                required={required}
            >
                <option value="">{optionBasic}</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default InputOption;