import React, { useState } from 'react';
import Form from '../../components/Form';
import { useRouter } from 'next/router';
import instance from '../../axios.config';

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState(null);
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
  ];

  async function handleSubmit(fieldValues) {
    try {
      await instance.post('/device_manufacturer/signup', fieldValues);
      router.push('/device_manufacturer/login');
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <>
      <Form error={error} fields={fields} handleSubmit={handleSubmit} />
    </>
  );
}
