import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  loader: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    zIndex: '9999',
  },
}));

export default function Loader() {
  const classes = useStyles();
  return (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  );
}
