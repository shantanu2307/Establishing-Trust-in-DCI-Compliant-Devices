import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import FileUpload from '../../components/FileUpload';
import instance from '../../axios.config';
import DistributionHouseList from '../../components/DistributionHouseList';
import CustomInput from '../../components/CustomInput';

export default function AddDKDM() {
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);
    const [success, setSuccess] = useState(2);
    const [movie, setMovie] = useState(null);
    useEffect(() => {
        if (!user.loggedIn || user.role !== 'distribution_house') {
            router.push('/distribution_house/login');
            return;
        }
    }, []);

    async function handleLogOut() {
        try {
            await instance.post('/distribution_house/logout');
            setUser({
                loggedIn: false,
                role: 'guest',
            });
            router.push('/distribution_house/login');
        } catch (e) {
            console.log(e);
        }
    }

    async function uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('movie_name', movie);
            const headers = {
                'Content-Type': 'multipart/form-data',
            };
            const res = await instance.post(
                '/distribution_house/add_dkdm',
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

    function handleChange(e) {
        setMovie(e.target.value);
    }


    return (
        <>
            <div>
                <Dashboard title={'Add DKDM'} handleLogOut={handleLogOut}>
                    <DistributionHouseList />
                    <FileUpload handleSubmit={uploadFile} success={success}>
                        <CustomInput type="text" handleChange={handleChange} />
                    </FileUpload>
                </Dashboard>
            </div>
        </>
    );
}
