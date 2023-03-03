import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import DashBoard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import CardList from '../../components/CardList';
import instance from '../../axios.config';
import useSWR from 'swr';

export default function Dashboard({ certificatesFromServer }) {
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);

  const { data } = useSWR('/device_manufacturer/get_certificates', {
    initialData: { certificates: certificatesFromServer },
  });

  useEffect(() => {
    if (!user.loggedIn || user.role !== 'device_manufacturer') {
      router.push('/device_manufacturer/login');
      return;
    }
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
        <DashBoard title={'Dashboard'} handleLogOut={handleLogOut}>
          <DeviceManufacturerList />
          <div>
            <CardList certificates={data?.certificates || []} />
          </div>
        </DashBoard>
      </div>
    </>
  );
}

Dashboard.getInitialProps = async (ctx) => {
  try {
    const res = await instance.get('/device_manufacturer/get_certificates');
    return { certificatesFromServer: res?.data?.certificates || [] };
  } catch (error) {
    console.log(error);
    return { certificatesFromServer: [] };
  }
};
