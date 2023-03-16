import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import DashBoard from '../../components/DashBoard';
import instance from '../../axios.config';
import useSWR from 'swr';
import { Pagination } from '@mui/material';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Loader from '../../components/Loader';
import TheatreOwnerList from '../../components/TheatreOwnerList';
import CardList from '../../components/CardList';

const useStyles = makeStyles(() => ({
    ul: {
        '& .MuiPaginationItem-root': {
            color: '#3f51b5',
            fontWeight: 'bold',
        },
    },
}));

export default function Dashboard({ certificatesFromServer }) {
    const classes = useStyles();
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);
    const [page, setPage] = useState(1);
    const { data, isLoading } = useSWR('/theatre_owner/get_certificates', {
        initialData: { certificates: certificatesFromServer },
    });

    const count = Math.ceil(data?.certificates?.length / 6);

    useEffect(() => {
        if (!user.loggedIn || user.role !== 'theatre_owner') {
            router.push('/theatre_owner/login');
            return;
        }
    }, []);

    function changePage(event, value) {
        setPage(value);
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

    if (isLoading) return <Loader />;

    return (
        <>
            <div>
                <DashBoard title={'Dashboard'} handleLogOut={handleLogOut}>
                    <TheatreOwnerList />
                    <Box
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        mt={'20px'}
                    >
                        <CardList page={page} certificates={data?.certificates || []} />
                    </Box>
                    <Box
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        mt={'20px'}
                    >
                        {count && (
                            <Pagination
                                classes={{ ul: classes.ul }}
                                page={page}
                                count={count}
                                onChange={changePage}
                            />
                        )}
                    </Box>
                </DashBoard>
            </div>
        </>
    );
}

Dashboard.getInitialProps = async (ctx) => {
    try {
        const res = await instance.get('/theatre_owner/get_certificates');
        return { certificatesFromServer: res?.data?.certificates || [] };
    } catch (error) {
        console.log(error);
        return { certificatesFromServer: [] };
    }
};
