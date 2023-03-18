import React, { useState } from 'react';
import Form from '../../components/Form';
import { useRouter } from 'next/router';
import instance from '../../axios.config';
import { Box, Typography } from '@material-ui/core';
import Link from 'next/link';

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
      <Typography style={{ marginTop: "20px" }} align='center' variant={'h4'}>Device Manufacturer Signup</Typography>
      <Form error={error} fields={fields} handleSubmit={handleSubmit} />
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        <Typography><Link href={'/device_manufacturer/login'}>Already have an account?</Link></Typography>
      </Box>
    </>
  );
}
