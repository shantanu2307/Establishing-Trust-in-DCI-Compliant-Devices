import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';


export default function addCertificate() {
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);

    useEffect(() => {
        if (!user.loggedIn || user.role !== 'device_manufacturer') {
            router.push('/device_manufacturer/login')
            return;
        }
    }, [])

    async function handleLogOut() {
        try {
            await axios.post('http://127.0.0.1:5000/device_manufacturer/logout');
            setUser({
                loggedIn: false,
                role: 'guest',
            });
            router.push('/device_manufacturer/login');
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <div>
                <Dashboard title={"Add Certificate"} handleLogOut={handleLogOut} >
                    <DeviceManufacturerList />
                </Dashboard>
            </div>
        </>
    )
}
