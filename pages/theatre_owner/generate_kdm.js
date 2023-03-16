import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Dashboard from '../../components/DashBoard';
import instance from '../../axios.config';
import TheatreOwnerList from '../../components/TheatreOwnerList';
import Form from '../../components/Form';
import { makeStyles } from '@material-ui/styles';
import useSWR from 'swr';
import Loader from '../../components/Loader';

const useStyles = makeStyles({
    select: {
        width: '100%',
        height: '40px',
        background: "none",
        border: "none",
    }
});

export default function GenerateKDM({ certificatesFromServer }) {
    const { data, isLoading } = useSWR('/theatre_owner/get_certificates', {
        initialData: { certificates: certificatesFromServer },
    });
    const classes = useStyles();
    const router = useRouter();
    const selectRef = useRef(null);
    const { user, setUser } = useContext(AppContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        if (!user.loggedIn || user.role !== 'theatre_owner') {
            router.push('/theatre_owner/login');
            return;
        }
    }, []);

    if (isLoading) return <Loader />;

    const fields = [
        {
            name: 'movie_name',
            label: 'Movie Name',
            type: 'email',
        },
        {
            name: 'starting_time',
            label: 'Start Time',
            type: 'text',
        }
    ];

    function download(texts) {
        const file = new Blob(texts, { type: 'text/plain' });
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = "kdm.txt"
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    async function handleSubmit(fieldValues) {
        try {
            const res = await instance.post('/theatre_owner/generate_kdm', {
                ...fieldValues,
                hash: selectRef.current.value,
            });
            const texts = [res.data];
            download(texts);
            setSuccess('KDM Generated Successfully');
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    async function handleLogOut() {
        try {
            await instance.post('/theatre_owner/logout');
            setUser({
                loggedIn: false,
                role: 'guest',
            });
            router.push('/theatre_owner/login');
        } catch (e) {

            console.log(e);
        }
    }

    return (
        <>
            <div>
                <Dashboard title={'Generate KDM'} handleLogOut={handleLogOut}>
                    <TheatreOwnerList />
                    <Form success={success} error={error} fields={fields} handleSubmit={handleSubmit}>
                        <select ref={selectRef} className={classes.select}>
                            {data?.certificates?.map((certificate, index) => (
                                <option value={certificate.hashed_key}>{certificate.device_name || ("Certificate" + (index + 1))}</option>
                            ))}
                        </select>
                    </Form>
                </Dashboard>
            </div>
        </>
    );
}

GenerateKDM.getInitialProps = async (ctx) => {
    try {
        const res = await instance.get('/theatre_owner/get_certificates');
        return { certificatesFromServer: res?.data?.certificates || [] };
    } catch (error) {
        console.log(error);
        return { certificatesFromServer: [] };
    }
};

