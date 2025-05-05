import React from 'react';
import cl from './SubmitButton.module.scss';

type SubmitButtonProps = {
  text: string;
  onClick: () => void;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, onClick }) => {
  return (
    <button className={cl.submit__button} onClick={onClick}>
      {text}
    </button>
  );
};

export default SubmitButton;
