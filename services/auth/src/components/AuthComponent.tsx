import { FormType } from '@/utils/type/FormType'
import React, { useState } from 'react'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { Outlet, useLocation } from 'react-router-dom'

const AuthComponent = () => {
    const [switchForm, setSwitchForm] = useState<FormType>({ type: 'register' })
    const location = useLocation()

    const isVerificationRoute = location.pathname.endsWith('/verify')

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AuthComponent
