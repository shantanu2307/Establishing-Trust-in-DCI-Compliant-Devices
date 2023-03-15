import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import DashBoard from '../../components/DashBoard';
import DistributionHouseList from '../../components/DistributionHouseList';
import instance from '../../axios.config';
import useSWR from 'swr';
import { Pagination } from '@mui/material';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Loader from '../../components/Loader';
import InteractiveList from '../../components/InteractiveList';

const useStyles = makeStyles(() => ({
    ul: {
        '& .MuiPaginationItem-root': {
            color: '#3f51b5',
            fontWeight: 'bold',
        },
    },
}));

export default function Dashboard({ dkdmsFromServer }) {
    const classes = useStyles();
    const router = useRouter();
    const { user, setUser } = useContext(AppContext);
    const [page, setPage] = useState(1);
    const { data, isLoading } = useSWR('/distribution_house/get_dkdm', {
        initialData: { dkdms: dkdmsFromServer },
    });

    const count = Math.ceil(data?.dkdms?.length / 10);

    useEffect(() => {
        if (!user.loggedIn || user.role !== 'distribution_house') {
            router.push('/distribution_house/login');
            return;
        }
    }, []);

    function changePage(event, value) {
        setPage(value);
    }

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

    if (isLoading) return <Loader />;

    return (
        <>
            <div>
                <DashBoard title={'Dashboard'} handleLogOut={handleLogOut}>
                    <DistributionHouseList />
                    <Box
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        mt={'20px'}
                    >
                        <InteractiveList page={page} dkdms={data?.dkdms || []} />
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
        const res = await instance.get('/distribution_house/get_dkdm');
        return { dkdmsFromServer: res?.data?.dkdms || [] };
    } catch (error) {
        console.log(error);
        return { dkdmsFromServer: [] };
    }
};
