import React, { useState } from 'react'
import SignupForm from '../../components/SignupForm'
import axios from 'axios';
import { useRouter } from 'next/router';
export default function signup() {
    const router = useRouter();
    const [error, setError] = useState('')
    const fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
        },
        {
            name: 'location',
            label: 'Location',
            type: 'text',
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
        },
        {
            name: 'account',
            label: 'Account',
            type: 'text',
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
        },

    ]

    async function handleSubmit(fieldValues) {
        try {
            await axios.post('http://127.0.0.1:5000/distribution_house/signup', fieldValues)
            router.push('/distribution_house/login')
        } catch (error) {
            setError(error.response.data.message)
            console.log(error);
        }
    }

    return (
        <>
            {error && <p>{error}</p>}
            <SignupForm fields={fields} handleSubmit={handleSubmit} />
        </>
    )
}
