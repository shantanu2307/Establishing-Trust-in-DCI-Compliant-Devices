import React, { useState } from 'react';
import CustomInput from './CustomInput';
import Button from './Button';
import styles from '../styles/form.module.css';
import Title from './Title';
import { Alert } from '@mui/material';

export default function FileUpload({ handleSubmit, success }) {
  const [file, setFile] = useState();

  const uploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    handleSubmit(file);
  };

  return (
    <form className={styles.form}>
      {success === 1 && (
        <Alert severity="success">Certificate added successfully</Alert>
      )}
      {success === 0 && (
        <Alert severity="error">Error adding certificate</Alert>
      )}
      <Title>UPLOAD CERTIFICATE</Title>
      <CustomInput type="file" handleChange={uploadFile} />
      <Button
        type="info"
        color="secondary"
        className={styles.form_custom_btn}
        onClick={handleSubmitButton}
      >
        Submit
      </Button>
    </form>
  );
}
