import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import FileUpload from '../../components/FileUpload';
import instance from '../../axios.config';

export default function AddCertificate() {
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);
  const [success, setSuccess] = useState(2);

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

  async function uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const res = await instance.post(
        '/device_manufacturer/add_certificate',
        formData,
        {
          headers: headers,
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setSuccess(1);
      }
    } catch (error) {
      setSuccess(0);
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <Dashboard title={'Add Certificate'} handleLogOut={handleLogOut}>
          <DeviceManufacturerList />
          <FileUpload handleSubmit={uploadFile} success={success} />
        </Dashboard>
      </div>
    </>
  );
}
