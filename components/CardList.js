import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Card from './Card';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  grid: {
    marginTop: '0px',
  },
}));

export default function CardList({ certificates, page }) {
  const styles = useStyles();
  const index = page * 6 - 6;
  return (
    <>
      <Grid container spacing={3} className={styles.grid}>
        {certificates.slice(index, index + 6).map((certificate, index) => (
          <Grid item key={index}>
            <Paper className={styles.paper}>
              <Card
                heading={'Certificate ' + (page * 6 - 5 + index)}
                hash={certificate.hashed_key}
                created_by={certificate.created_by}
                created_at={certificate.created}
                updated_at={certificate.updated}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
