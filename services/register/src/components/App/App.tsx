import React from 'react';
import cl from './App.module.scss';
import { useParams } from 'react-router-dom';
import { spawn } from 'child_process';
import RegisterForm from '../RegisterForm';

export const App = () => {

    return (
        <div className={cl.registerWrapper}>
            <RegisterForm />
        </div>
        
    );
};
