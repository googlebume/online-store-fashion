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
    /** Якщо false — не додається перший <option value=""> (наприклад, для обов’язкового enum-поля). */
    includeBlankOption?: boolean;
};

const InputOption: React.FC<OptionInputType> = ({
    label,
    optionBasic = '',
    options,
    value,
    onChange,
    disabled = false,
    required = true,
    includeBlankOption = true,
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
                {includeBlankOption ? <option value="">{optionBasic}</option> : null}
                {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default InputOption;

