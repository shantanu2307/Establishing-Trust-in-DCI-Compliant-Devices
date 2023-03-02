import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import FileUpload from '../../components/FileUpload';

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
      await axios.post('http://127.0.0.1:5000/device_manufacturer/logout');
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
      const url = 'http://127.0.0.1:5000/device_manufacturer/add_certificate';
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const res = await axios.post(url, formData, {
        headers: headers,
        withCredentials: true,
      });
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
