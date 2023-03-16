import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import DashBoard from '../../components/DashBoard';
import DeviceManufacturerList from '../../components/DeviceManufacturerList';
import CardList from '../../components/CardList';
import instance from '../../axios.config';
import useSWR from 'swr';
import { Pagination } from '@mui/material';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Loader from '../../components/Loader';

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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSWR('/device_manufacturer/get_certificates', {
    initialData: { certificates: certificatesFromServer },
  });

  const count = Math.ceil(data?.certificates?.length / 6);

  useEffect(() => {
    if (!user.loggedIn || user.role !== 'device_manufacturer') {
      router.push('/device_manufacturer/login');
      return;
    }
  }, []);

  function changePage(event, value) {
    setPage(value);
  }

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

  if (isLoading || loading) return <Loader />;

  return (
    <>
      <div>
        <DashBoard title={'Dashboard'} handleLogOut={handleLogOut}>
          <DeviceManufacturerList />
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={'20px'}
          >
            <CardList role={"device_manufacturer"} page={page} certificates={data?.certificates || []} />
          </Box>
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={'20px'}
          >
            <Pagination
              classes={{ ul: classes.ul }}
              page={page}
              count={count}
              onChange={changePage}
            />
          </Box>
        </DashBoard>
      </div>
    </>
  );
}

Dashboard.getInitialProps = async (ctx) => {
  try {
    setLoading(true);
    const res = await instance.get('/device_manufacturer/get_certificates');
    setLoading(false);
    return { certificatesFromServer: res?.data?.certificates || [] };
  } catch (error) {
    console.log(error);
    return { certificatesFromServer: [] };
  }
};
