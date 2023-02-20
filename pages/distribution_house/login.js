import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import LoginForm from '../../components/LoginForm';
export default function login() {
    const router = useRouter();
    const [error, setError] = useState('')
    const fields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
        },

    ]

    async function handleSubmit(fieldValues) {
        try {
            await axios.post('http://127.0.0.1:5000/distribution_house/login', fieldValues)
            router.push('/distribution_house/home')
            console.log('success');
        } catch (error) {
            setError(error.response.data.message)
            console.log(error);
        }
    }

    return (
        <>
            {error && <p>{error}</p>}
            <LoginForm fields={fields} handleSubmit={handleSubmit} />
        </>
    )
}
