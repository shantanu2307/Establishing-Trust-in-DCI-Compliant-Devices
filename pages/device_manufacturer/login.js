import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoginForm from '../../components/LoginForm';
import { AppContext } from '../../contexts/AppContext';
import { useContext } from 'react';
import instance from '../../axios.config';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { setUser } = useContext(AppContext);
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
  ];

  async function handleSubmit(fieldValues) {
    try {
      await instance.post('/device_manufacturer/login', fieldValues);
      setUser({
        loggedIn: true,
        role: 'device_manufacturer',
      });
      router.push('/device_manufacturer/dashboard');
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <>
      <LoginForm error={error} fields={fields} handleSubmit={handleSubmit} />
    </>
  );
}
