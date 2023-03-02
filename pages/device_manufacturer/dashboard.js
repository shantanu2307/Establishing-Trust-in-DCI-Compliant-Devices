import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import DashBoard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import CardList from '../../components/CardList';
import instance from '../../axios.config';

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  async function getCertificates() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const res = await instance.get('/device_manufacturer/get_certificates', {
      headers: headers,
      withCredentials: true,
    });
    if (res.status === 200) {
      setCertificates(res.data.certificates);
      setLoading(false);
      console.log(res.data.certificates);
    }
  }

  useEffect(() => {
    if (!user.loggedIn || user.role !== 'device_manufacturer') {
      router.push('/device_manufacturer/login');
      return;
    }
    getCertificates();
  }, []);

  async function handleLogOut() {
    try {
      await instance.post('/device_manufacturer/logout');
      setUser({
        loggedIn: false,
        role: 'guest',
      });
      router.push('/device_manufacturer/login');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div>
        <DashBoard
          title={'Dashboard'}
          certificates={certificates}
          handleLogOut={handleLogOut}
        >
          <DeviceManufacturerList />
          <CardList certificates={certificates} />
        </DashBoard>
      </div>
    </>
  );
}
