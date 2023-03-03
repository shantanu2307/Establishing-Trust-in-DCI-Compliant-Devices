import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Card from './Card';
import useSWR, { mutate } from 'swr';
import { trigger } from 'swr';


const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  grid: {
    marginTop: '20px',
  },
}));


export default function CardList({ certificates }) {
  const styles = useStyles();
  const { data } = useSWR('/device_manufacturer/get_certificates');

  async function handleSubmit(field) {
    try {
      console.log(field);
      mutate('/device_manufacturer/get_certificates', {
        certificates: data?.certificates.filter(
          (certificate) => certificate.hashed_key !== certificates[index].hashed_key
        ),
      });
      // const res = await instance.post('/device_manufacturer/transfer', {
      //   hashed_key: certificates[index].hashed_key,
      //   account: field,
      // });
      trigger('/device_manufacturer/get_certificates');
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Grid container spacing={3} className={styles.grid}>
        {certificates.map((certificate, index) => (
          <Grid item key={index}>
            <Paper className={styles.paper}>
              <Card
                heading={'Certificate ' + (index + 1)}
                hash={certificate.hashed_key}
                created_by={certificate.created_by}
                created_at={certificate.created}
                updated_at={certificate.updated}
                handleSubmit={handleSubmit}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
