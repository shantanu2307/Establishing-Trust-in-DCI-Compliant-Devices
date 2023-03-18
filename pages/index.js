import React from 'react';
import { useRouter } from 'next/router';

export default function Homepage() {
  const router = useRouter();
  return (
    <div>
      <h1>Who are you?</h1>
      <button onClick={(e) => {
        e.preventDefault();
        router.push('/distribution_house/login');
      }}>Distribution House</button>
      <button onClick={(e) => {
        e.preventDefault();
        router.push('/device_manufacturer/login');
      }}>Device Manufacturer</button>
      <button onClick={(e) => {
        e.preventDefault();
        router.push('/theatre_owner/login');
      }}>Theatre Owner</button>
    </div>
  );
}
