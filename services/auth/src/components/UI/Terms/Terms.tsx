import React from 'react';
import cl from './Terms.module.scss'

const Terms = () => {
    return (
        <div className={cl.terms}>
            <input type="checkbox" id="terms" name="terms" required className={cl.checkbox} />
            <label htmlFor="terms" className={cl.termsText}>
                Я погоджуюсь з <a href="#">Умовами використання</a> та <a href="#">Політикою конфіденційності</a>
            </label>
        </div>
    );
};

export default Terms;

