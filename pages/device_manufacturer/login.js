import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Form from '../../components/Form';
import { AppContext } from '../../contexts/AppContext';
import { useContext } from 'react';
import instance from '../../axios.config';
import Link from 'next/link';
import { Box, Typography } from '@material-ui/core';


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
      <Typography style={{ marginTop: "20px" }} align='center' variant={'h4'}>Device Manufacturer Login</Typography>
      <Form error={error} fields={fields} handleSubmit={handleSubmit} />
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        <Typography><Link href={'/device_manufacturer/signup'}>Need an account?</Link></Typography>
      </Box>
    </>
  );
}
