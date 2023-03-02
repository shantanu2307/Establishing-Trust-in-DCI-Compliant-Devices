import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import CardList from '../../components/CardList';



export default function dashboard() {
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    async function getCertificates() {
        const url = "http://127.0.0.1:5000/device_manufacturer/get_certificates"
        const headers = {
            'Content-Type': 'application/json'
        }
        const res = await axios.get(url, { headers: headers, withCredentials: true });
        if (res.status === 200) {
            setCertificates(res.data.certificates)
            setLoading(false);
            console.log(res.data.certificates);
        }
    }

    useEffect(() => {
        if (!user.loggedIn || user.role !== 'device_manufacturer') {
            router.push('/device_manufacturer/login')
            return;
        }
        getCertificates()
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
                <Dashboard title={"Dashboard"} certificates={certificates} handleLogOut={handleLogOut} >
                    <DeviceManufacturerList />
                    <CardList certificates={certificates} />
                </Dashboard>
            </div>
        </>
    )
}
