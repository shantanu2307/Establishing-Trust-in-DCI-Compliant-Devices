import { makeStyles } from '@material-ui/styles';
import React, { useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import instance from '../axios.config';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#f2f2f2',
    width: '300px',
    border: '1px thin black',
    fontFamily: 'sans-serif',
    display: 'grid',
    gridTemplateRows: '1fr 4fr 1fr',
    margin: '10px',
    '&>div': {
      border: '1px solid black',
    },
  },
  card_header: {
    backgroundColor: '#3f51b5',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  card_body: {
    padding: '10px',
    textAlign: 'left',
    display: 'grid',
    gridTemplateRows: '5fr 1fr 1fr',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: `"hash hash" "hash hash" "hash hash" "by by" "at update"`,
  },
  hash: {
    gridArea: 'hash',
    fontSize: '20px',
    wordWrap: 'break-word',
  },
  by: {
    gridArea: 'by',
    marginBottom: '20px',
  },
  at: {
    gridArea: 'at',
  },
  update: {
    gridArea: 'update',
  },
  card_footer: {
    display: 'grid',
    gridTemplateColumns: '4fr 1fr',
    padding: '10px',
    coloumnGap: '3px',
  },
  item1: {
    border: '1px solid black',
  },
  item2: {
    border: '1px solid black',
    borderRadius: '50%',
  },
  button: {
    backgroundColor: 'red',
    color: 'white',
    marginLeft: '1px',
    border: '1px solid black',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f44336',
    },
  },
  input: {
    border: '1px solid black',
    fontSize: '16px',
  },
}));

export default function Card(props) {
  const classes = useStyles();
  const textRef = useRef(null);
  const [field, setField] = useState(null);
  const { mutate } = useSWRConfig();
  function handleChange() {
    setField(textRef.current.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await instance.post('/device_manufacturer/transfer_ownership', {
        hash: props.hash,
        new_owner: field,
      });
      mutate('/device_manufacturer/get_certificates', null, false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.card_header}>
        <h3>{props.heading}</h3>
      </div>

      <div className={classes.card_body}>
        <h2 className={classes.hash}>{props.hash}</h2>
        <h3 className={classes.by}>Created by: {props.created_by}</h3>
        <h4 className={classes.at}>Created At: {props.created_at}</h4>
        <h4 className={classes.update}>Updated At: {props.updated_at}</h4>
      </div>

      <div className={classes.card_footer}>
        <input
          className={classes.input}
          type="text"
          ref={textRef}
          onChange={handleChange}
        ></input>
        <button className={classes.button} onClick={handleSubmit}>
          Tranfer
        </button>
      </div>
    </div>
  );
}
