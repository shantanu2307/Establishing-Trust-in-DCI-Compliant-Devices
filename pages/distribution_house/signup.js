import React, { useState } from 'react';
import SignupForm from '../../components/SignupForm';
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
      name: 'password',
      label: 'Password',
      type: 'password',
    },
  ];

  async function handleSubmit(fieldValues) {
    try {
      await instance.post('/distribution_house/signup', fieldValues);
      router.push('/distribution_house/login');
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <>
      <SignupForm error={error} fields={fields} handleSubmit={handleSubmit} />
    </>
  );
}
