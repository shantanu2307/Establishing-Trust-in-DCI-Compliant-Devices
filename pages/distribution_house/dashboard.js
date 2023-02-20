import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function dashboard() {
    const router = useRouter();
    const { user } = useContext(AppContext);
    const [certificates, setCertificates] = useState([]);
    async function getCertificates() {
        const url = "http://127.0.0.1:5000/distribution_house/get_certificates"
        const headers = {
            'Content-Type': 'application/json'
        }
        const res = await axios.get(url, { headers: headers, withCredentials: true });
        if (res.status === 200) {
            setCertificates(res.data.certificates)
        }
    }

    useEffect(() => {
        if (!user.loggedIn || user.role !== 'distribution_house') {
            router.push('/distribution_house/login')
            return;
        }
        getCertificates()
    }, [])

    return (
        <>
            <div>
                <h1>Dashboard</h1>
                {certificates.map((certificate, index) => (
                    <div key={index}> {certificate} </div>
                ))}
            </div>
        </>
    )
}
